import { OrderModel, OrderItemModel, PlatoModel, MenuDiarioModel } from '@/SequelizeModels'
import { Order, OrderStatus, OrderModalidad, PaymentStatus } from '../entities/Order'
import { OrderItem } from '../entities/OrderItem'

export class OrderMapper {
  static toDomain(model: OrderModel): Order {
    const items = model.items?.map((item: any) => new OrderItem(
      item.id,
      item.orderId,
      item.platoId,
      item.diarioId,
      item.cantidad,
      parseFloat(item.precioUnitario.toString()),
      item.notes,
      item.plato?.name || (item.diarioId ? 'Menú del Día' : 'Producto'),
      item.plato?.imageUrl,
      item.estado as OrderStatus
    )) || []

    return new Order(
      model.id,
      model.userId,
      model.customerName,
      model.mesaId,
      model.modalidad as OrderModalidad,
      model.estado as OrderStatus,
      model.pagoEstado as PaymentStatus,
      items,
      parseFloat(model.total.toString()),
      model.createdAt,
      model.updatedAt
    )
  }

  static toPersistence(entity: Order): any {
    return {
      id: entity.id,
      user_id: entity.userId,
      customer_name: entity.customerName,
      mesa_id: entity.mesaId,
      modalidad: entity.modalidad,
      estado: entity.estado,
      pago_estado: entity.pagoEstado,
      total: entity.total,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    }
  }

  static toPersistenceItem(item: OrderItem): any {
    return {
      id: item.id,
      order_id: item.orderId,
      plato_id: item.platoId,
      diario_id: item.diarioId,
      cantidad: item.cantidad,
      precio_unitario: item.precioUnitario,
      notas: item.notas,
      estado: item.estado
    }
  }
}
