import { IOrderRepository } from '../repositories/interfaces/IOrderRepository'
import { OrderStatus } from '../entities/Order'
import { getSocket } from '@/shared/infrastructure/websocket/socket.server'

export class CambiarEstadoItem {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(itemId: string, nuevoEstado: OrderStatus): Promise<void> {
    // 1. Actualizar estado del ítem vía repositorio
    const { orderId } = await this.orderRepository.updateItemStatus(itemId, nuevoEstado)

    // 2. Lógica: Si todos los platos están ENTREGADO, marcar la orden como ENTREGADO
    if (nuevoEstado === 'ENTREGADO') {
      const todosEntregados = await this.orderRepository.areAllItemsDelivered(orderId)
      if (todosEntregados) {
        await this.orderRepository.updateStatus(orderId, 'ENTREGADO')
      }
    }

    // 3. Notificación en tiempo real
    try {
      const io = getSocket()
      const orderActualizada = await this.orderRepository.findById(orderId)
      if (orderActualizada) {
        io.emit(`pedido_actualizado_${orderId}`, orderActualizada)
        io.emit('orden_actualizada_general', { orderId, estado: orderActualizada.estado })
      }
    } catch (e) {
      // Ignorar si socket no listo
    }
  }
}
