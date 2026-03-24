import { Order } from '../../entities/Order'

export interface IOrderRepository {
  save(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
  findByMesa(mesaId: string, soloPendientesPago?: boolean): Promise<Order[]>
  listActivos(): Promise<Order[]> // PENDIENTES, PREPARANDO, LISTOS
  updateStatus(id: string, estado: string): Promise<void>
}
