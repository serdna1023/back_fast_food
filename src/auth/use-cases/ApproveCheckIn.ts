import { ITokenService } from '../security/ITokenService';
import { IMesaRepository } from '@/orders/repositories/interfaces/IMesaRepository';
import { IOrderRepository } from '@/orders/repositories/interfaces/IOrderRepository';
import { getSocket } from '@/shared/infrastructure/websocket/socket.server';
import { ApproveCheckInRequest, ApproveCheckInResponse } from '../dtos/ApproveCheckInDTO';
import { Order, OrderModalidad } from '@/orders/entities/Order';
import { v4 as uuidv4 } from 'uuid';

export class ApproveCheckIn {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly mesaRepository: IMesaRepository,
    private readonly orderRepository: IOrderRepository
  ) {}

  async execute(request: ApproveCheckInRequest): Promise<ApproveCheckInResponse> {
    const { restaurantId, mesaId } = request;

    // 1. Validar mesa usando la entidad de dominio
    const mesa = await this.mesaRepository.findById(mesaId, restaurantId);
    if (!mesa) throw new Error('Mesa no encontrada');

    // 2. Buscar orden activa o crear una nueva
    const pedidosMesa = await this.orderRepository.findByMesa(mesaId, true);
    let activeOrder = pedidosMesa.length > 0 ? pedidosMesa[0] : null;

    if (!activeOrder) {
      const orderId = uuidv4();
      activeOrder = new Order(
        orderId,
        null,       // userId (guest no tiene usuario del sistema)
        null,       // customerName
        mesaId,
        'MESA' as OrderModalidad,
        'PENDIENTE',
        'PENDIENTE',
        [],         // items
        0,          // total
        new Date(),
        new Date(),
        restaurantId
      );
      await this.orderRepository.save(activeOrder);
    }

    // 3. Ocupar la mesa usando el método de dominio
    mesa.ocupar(activeOrder.id);
    await this.mesaRepository.save(mesa);

    // 4. Generar GuestToken vinculado a esta Orden y Mesa
    const guestToken = this.tokenService.generateToken(
      {
        sub: 'GUEST',
        restaurantId,
        mesaId,
        orderId: activeOrder.id,
        roles: ['GUEST'],
        permissions: ['READ_MENU', 'SEND_ORDER_ITEM']
      },
      '4h'
    );

    // 5. Notificar al cliente via WebSockets
    try {
      const io = getSocket();
      io.to(`mesa_${restaurantId}_${mesaId}`).emit('checkin_approved', {
        guestToken,
        orderId: activeOrder.id
      });
    } catch (e) {
      console.warn('Socket no inicializado, evento no enviado');
    }

    return { guestToken, orderId: activeOrder.id };
  }
}
