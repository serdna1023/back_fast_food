import { IMesaRepository } from '@/orders/repositories/interfaces/IMesaRepository';
import { getSocket } from '@/shared/infrastructure/websocket/socket.server';
import { CheckInRequest } from '../dtos/RequestCheckInDTO';

export class RequestCheckIn {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async execute(request: CheckInRequest): Promise<void> {
    const { restaurantId, mesaId } = request;

    // 1. Validar mesa usando la entidad de dominio
    const mesa = await this.mesaRepository.findById(mesaId, restaurantId);
    if (!mesa) throw new Error('La mesa no existe');

    // 2. Poner en espera usando el método de dominio (valida que no esté OCCUPIED)
    mesa.ponerEnEspera();
    await this.mesaRepository.save(mesa);

    // 3. Notificar al Staff via WebSockets
    try {
      const io = getSocket();
      io.to(`restaurant_${restaurantId}`).emit('checkin_request', {
        mesaId,
        message: `La Mesa ${mesaId} está solicitando ser abierta.`
      });
    } catch (e) {
      console.warn('Socket no inicializado, evento no enviado');
    }
  }
}
