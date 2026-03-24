import { Plato } from '@/menu/entities/Plato'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'
import { PlatoModel } from '@/SequelizeModels'
import { PlatoMapper } from '@/menu/mappers/PlatoMapper'
import { Op } from 'sequelize'

/**
 * Implementación concreta del repositorio de Platos utilizando Sequelize.
 */
export class SequelizePlatoRepository implements IPlatoRepository {
  /**
   * Busca un plato específico por id.
   * @param id - Identificador del plato
   */
  async findById(id: string): Promise<Plato | null> {
    const model = await PlatoModel.findByPk(id)
    if (!model) return null
    return PlatoMapper.toDomain(model)
  }

  /**
   * Devuelve todos los platos asociados a un `categoryId`.
   * @param categoryId - El ID de la categoría padre
   */
  async findByCategory(categoryId: string): Promise<Plato[]> {
    const models = await PlatoModel.findAll({ where: { categoryId } })
    return models.map((m) => PlatoMapper.toDomain(m))
  }

  /**
   * Obtiene todos los platos listados en la BD.
   */
  async findAll(): Promise<Plato[]> {
    const models = await PlatoModel.findAll()
    return models.map((m) => PlatoMapper.toDomain(m))
  }

  /**
   * Busca platos cuyo nombre contenga el texto de búsqueda (case-insensitive).
   * Usa Op.iLike de Sequelize para PostgreSQL.
   * @param query - Texto parcial a buscar
   */
  async searchByName(query: string): Promise<Plato[]> {
    const models = await PlatoModel.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }
      }
    })
    return models.map((m) => PlatoMapper.toDomain(m))
  }

  /**
   * Guarda un nuevo plato o lo actualiza si ya existe.
   * @param plato - La entidad de dominio pura
   */
  async save(plato: Plato): Promise<void> {
    const rawData = PlatoMapper.toPersistence(plato)

    const existing = await PlatoModel.findByPk(plato.id)
    if (existing) {
      await existing.update(rawData)
    } else {
      await PlatoModel.create(rawData)
    }
  }

  /**
   * Elimina permanentemente el plato.
   * @param id - Identificador a borrar
   */
  async delete(id: string): Promise<void> {
    await PlatoModel.destroy({ where: { id } })
  }
}
