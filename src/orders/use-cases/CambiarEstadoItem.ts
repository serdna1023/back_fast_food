import { OrderItemModel, OrderModel } from '@/SequelizeModels'
import { OrderStatus } from '../entities/Order'
import { IOrderRepository } from '../repositories/interfaces/IOrderRepository'
import { getSocket } from '@/shared/infrastructure/websocket/socket.server'

export class CambiarEstadoItem {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(itemId: string, nuevoEstado: OrderStatus): Promise<void> {
    const item = await OrderItemModel.findByPk(itemId)
    if (!item) throw new Error('Item del pedido no encontrado')

    await OrderItemModel.update(
      { estado: nuevoEstado },
      { where: { id: itemId } }
    )

    // Lógica inteligente: Si todos los platos están "ENTREGADO", marcar la orden global como "ENTREGADO"
    if (nuevoEstado === 'ENTREGADO') {
      const itemsDeOrden = await OrderItemModel.findAll({ where: { orderId: item.orderId } })
      const todosEntregados = itemsDeOrden.every(i => i.estado === 'ENTREGADO')

      if (todosEntregados) {
        await OrderModel.update(
          { estado: 'ENTREGADO' },
          { where: { id: item.orderId } }
        )
      }
    }

    // Notificación en tiempo real ENRIQUECIDA
    try {
      const io = getSocket()
      const orderActualizada = await this.orderRepository.findById(item.orderId)
      
      if (orderActualizada) {
        // Emitimos a la orden específica con toda la data nueva (platos, totales, estados)
        io.emit(`pedido_actualizado_${item.orderId}`, orderActualizada)
        io.emit('orden_actualizada_general', { orderId: item.orderId, estado: orderActualizada.estado })
      }
    } catch (e) {
      // Ignorar si socket no listo
    }
  }
}
