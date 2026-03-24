import { IOrderRepository } from '../repositories/interfaces/IOrderRepository'
import { OrderStatus } from '../entities/Order'
import { getSocket } from '@/shared/infrastructure/websocket/socket.server'

export class CambiarEstadoPedido {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string, nuevoEstado: OrderStatus): Promise<void> {
    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new Error('Pedido no encontrado')

    // Lógica de dominio
    if (nuevoEstado === 'PREPARANDO') order.marcarComoPreparando()
    else if (nuevoEstado === 'LISTO') order.marcarComoListo()
    else if (nuevoEstado === 'ENTREGADO') order.marcarComoEntregado()
    else if (nuevoEstado === 'CANCELADO') order.cancelar()

    await this.orderRepository.save(order)

    // Notificación en tiempo real ENRIQUECIDA
    try {
      const io = getSocket()
      // Emitimos el objeto completo para que el cliente vea el cambio de estado global
      io.emit(`pedido_actualizado_${orderId}`, order)
      io.emit('orden_actualizada_general', { orderId, estado: nuevoEstado })
    } catch (e) {
      // Ignorar
    }
  }
}
