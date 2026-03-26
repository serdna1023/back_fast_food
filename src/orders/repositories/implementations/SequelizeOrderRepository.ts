import { Op } from 'sequelize'
import { sequelize, OrderModel, OrderItemModel, PlatoModel, MenuDiarioModel } from '@/SequelizeModels'
import { Order } from '../../entities/Order'
import { IOrderRepository } from '../interfaces/IOrderRepository'
import { OrderMapper } from '../../mappers/OrderMapper'

export class SequelizeOrderRepository implements IOrderRepository {
  async save(order: Order): Promise<void> {
    const transaction = await sequelize.transaction()
    try {
      const rawOrder = OrderMapper.toPersistence(order)
      const rawItems = order.items.map(item => OrderMapper.toPersistenceItem(item))

      // Upsert cabezal
      await OrderModel.upsert(rawOrder, { transaction })

      // Sincronizar items (Delete + Create o Upsert masivo)
      // Para pedidos, solemos crear una vez y no editar mucho, 
      // pero el patrón de sincronización total es más seguro para Use Cases de edición.
      await OrderItemModel.destroy({
        where: { order_id: order.id },
        transaction
      })

      if (rawItems.length > 0) {
        await OrderItemModel.bulkCreate(rawItems, { transaction })
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async findById(id: string): Promise<Order | null> {
    const model = await OrderModel.findByPk(id, {
      include: [
        { model: OrderItemModel, as: 'items', include: [
            { model: PlatoModel, as: 'plato' },
            { model: MenuDiarioModel, as: 'menuDiario' }
        ]}
      ]
    })

    if (!model) return null
    return OrderMapper.toDomain(model)
  }

  async findByMesa(mesaId: string, soloPendientesPago: boolean = true): Promise<Order[]> {
    const where: any = { mesaId }
    if (soloPendientesPago) {
      where.pagoEstado = 'PENDIENTE'
    }

    const models = await OrderModel.findAll({
      where,
      include: [{ model: OrderItemModel, as: 'items' }],
      order: [['created_at', 'ASC']]
    })

    return models.map(m => OrderMapper.toDomain(m))
  }

  async listActivos(): Promise<Order[]> {
    const models = await OrderModel.findAll({
      where: {
        estado: { [Op.in]: ['PENDIENTE', 'PREPARANDO', 'LISTO'] }
      },
      include: [{ model: OrderItemModel, as: 'items' }],
      order: [['created_at', 'DESC']]
    })

    return models.map(m => OrderMapper.toDomain(m))
  }

  async updateStatus(id: string, estado: string): Promise<void> {
    await OrderModel.update({ estado }, { where: { id } })
  }

  async updateItemStatus(itemId: string, nuevoEstado: string): Promise<{ orderId: string }> {
    const item = await OrderItemModel.findByPk(itemId)
    if (!item) throw new Error('Item del pedido no encontrado')
    await OrderItemModel.update({ estado: nuevoEstado }, { where: { id: itemId } })
    return { orderId: item.orderId }
  }

  async areAllItemsDelivered(orderId: string): Promise<boolean> {
    const items = await OrderItemModel.findAll({ where: { orderId } })
    return items.length > 0 && items.every(i => i.estado === 'ENTREGADO')
  }
}
