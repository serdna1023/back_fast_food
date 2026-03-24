import { IOrderRepository } from '../repositories/interfaces/IOrderRepository'
import { Order } from '../entities/Order'

export class ObtenerDetallePedido {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new Error('Pedido no encontrado')
    return order
  }
}
