import { IOrderRepository } from '../repositories/interfaces/IOrderRepository'
import { Order } from '../entities/Order'

export class ObtenerDetallePedido {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string, restaurantId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId, restaurantId)
    if (!order) throw new Error('Pedido no encontrado o acceso denegado')
    return order
  }
}
