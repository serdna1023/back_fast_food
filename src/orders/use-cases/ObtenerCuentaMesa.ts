import { IOrderRepository } from '../repositories/interfaces/IOrderRepository'

export class ObtenerCuentaMesa {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(mesaId: string) {
    const orders = await this.orderRepository.findByMesa(mesaId, true) // Solo pendientes de pago
    
    if (orders.length === 0) {
      return { mesaId, totalGeneral: 0, pedidos: [] }
    }

    const totalGeneral = orders.reduce((sum, order) => sum + order.total, 0)

    return {
      mesaId,
      totalGeneral,
      cantidadPedidos: orders.length,
      pedidos: orders.map(o => ({
        id: o.id,
        total: o.total,
        estado: o.estado,
        createdAt: o.createdAt
      }))
    }
  }
}
