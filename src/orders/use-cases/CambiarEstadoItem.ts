import { IOrderRepository } from '../repositories/interfaces/IOrderRepository'
import { OrderStatus } from '../entities/Order'
import { getSocket } from '@/shared/infrastructure/websocket/socket.server'

export class CambiarEstadoItem {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(itemId: string, restaurantId: string, nuevoEstado: OrderStatus): Promise<void> {
    // 1. Actualizar estado del ítem vía repositorio (valida restaurantId internamente)
    const { orderId } = await this.orderRepository.updateItemStatus(itemId, restaurantId, nuevoEstado)

    // 2. Lógica: Si todos los platos están ENTREGADO, marcar la orden como ENTREGADO
    if (nuevoEstado === 'ENTREGADO') {
      const todosEntregados = await this.orderRepository.areAllItemsDelivered(orderId)
      if (todosEntregados) {
        await this.orderRepository.updateStatus(orderId, restaurantId, 'ENTREGADO')
      }
    }

    // 3. Notificación en tiempo real
    try {
      const io = getSocket()
      const orderActualizada = await this.orderRepository.findById(orderId, restaurantId)
      if (orderActualizada) {
        io.to(`restaurant_${restaurantId}`).emit(`pedido_actualizado_${orderId}`, orderActualizada)
        io.to(`restaurant_${restaurantId}`).emit('orden_actualizada_general', { orderId, estado: orderActualizada.estado })
      }
    } catch (e) {
      // Ignorar si socket no listo
    }
  }
}
