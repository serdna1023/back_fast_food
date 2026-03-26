import { Order } from '../../entities/Order'

export interface IOrderRepository {
  save(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
  findByMesa(mesaId: string, soloPendientesPago?: boolean): Promise<Order[]>
  listActivos(): Promise<Order[]>
  updateStatus(id: string, estado: string): Promise<void>
  updateItemStatus(itemId: string, nuevoEstado: string): Promise<{ orderId: string }>
  areAllItemsDelivered(orderId: string): Promise<boolean>
}
