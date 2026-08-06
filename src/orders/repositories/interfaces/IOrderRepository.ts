import { Order } from '../../entities/Order'

export interface IOrderRepository {
  save(order: Order): Promise<void>
  findById(id: string, restaurantId: string): Promise<Order | null>
  findByMesa(mesaId: string, restaurantId: string, soloPendientesPago?: boolean): Promise<Order[]>
  listActivos(restaurantId: string): Promise<Order[]>
  updateStatus(id: string, restaurantId: string, estado: string): Promise<void>
  updateItemStatus(itemId: string, restaurantId: string, nuevoEstado: string): Promise<{ orderId: string }>
  areAllItemsDelivered(orderId: string): Promise<boolean>
}
