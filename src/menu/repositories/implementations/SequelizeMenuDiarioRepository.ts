import { IMenuDiarioRepository } from '@/menu/repositories/interfaces/IMenuDiarioRepository'
import { MenuDiario } from '@/menu/entities/MenuDiario'
import { MenuDiarioModel, MenuPlatoModel, PlatoModel, sequelize } from '@/SequelizeModels'
import { MenuDiarioMapper } from '@/menu/mappers/MenuDiarioMapper'

export class SequelizeMenuDiarioRepository implements IMenuDiarioRepository {
  async findById(id: string, restaurantId: string): Promise<MenuDiario | null> {
    const model = await MenuDiarioModel.findOne({
      where: { id, restaurantId },
      include: [{
        model: MenuPlatoModel,
        as: 'platos',
        include: [{ model: PlatoModel, as: 'plato' }]
      }]
    })
    if (!model) return null
    return MenuDiarioMapper.toDomain(model)
  }

  async findByDate(date: Date, restaurantId: string): Promise<MenuDiario | null> {
    const model = await MenuDiarioModel.findOne({
      where: { fecha: date, restaurantId },
      include: [{
        model: MenuPlatoModel,
        as: 'platos',
        include: [{ model: PlatoModel, as: 'plato' }]
      }]
    })
    if (!model) return null
    return MenuDiarioMapper.toDomain(model)
  }

  async findAll(restaurantId: string): Promise<MenuDiario[]> {
    const models = await MenuDiarioModel.findAll({
      where: { restaurantId },
      order: [['fecha', 'DESC']],
      include: [{
        model: MenuPlatoModel,
        as: 'platos',
        include: [{ model: PlatoModel, as: 'plato' }]
      }]
    })
    return models.map(m => MenuDiarioMapper.toDomain(m))
  }

  async save(menu: MenuDiario): Promise<void> {
    const transaction = await sequelize.transaction()
    try {
      const existing = await MenuDiarioModel.findOne({ 
        where: { id: menu.id, restaurantId: menu.restaurantId }, 
        transaction 
      })
      
      const rawMenu = MenuDiarioMapper.toPersistence(menu)

      if (existing) {
        await existing.update(rawMenu, { transaction })
        // Limpiamos platos anteriores para reemplazarlos (transaccional)
        await MenuPlatoModel.destroy({ where: { menuDiarioId: menu.id }, transaction })
      } else {
        await MenuDiarioModel.create(rawMenu, { transaction })
      }

      // Insertamos los platos actuales
      const rawPlatos = menu.platos.map(p => MenuDiarioMapper.toPersistenceDetalle(p))
      await MenuPlatoModel.bulkCreate(rawPlatos, { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async delete(id: string, restaurantId: string): Promise<void> {
    await MenuDiarioModel.destroy({ where: { id, restaurantId } })
  }
}
