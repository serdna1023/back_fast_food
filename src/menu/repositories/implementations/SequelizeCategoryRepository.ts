import { ICategoryRepository } from '@/menu/repositories/interfaces/ICategoryRepository'
import { Category } from '@/menu/entities/Category'
import { CategoryModel } from '@/SequelizeModels'
import { CategoryMapper } from '@/menu/mappers/CategoryMapper'

/**
 * Implementación concreta del repositorio de Categorías utilizando Sequelize.
 * Actúa como adaptador de salida (Output Adapter), conectando la base de datos
 * real con nuestras interfaces de dominio puro.
 */
export class SequelizeCategoryRepository implements ICategoryRepository {
  /**
   * Busca una categoría por su ID.
   * @param id - Identificador de la categoría.
   * @returns Entidad Category si la encuentra, o null en caso contrario.
   */
  async findById(id: string): Promise<Category | null> {
    const model = await CategoryModel.findByPk(id)
    if (!model) return null
    return CategoryMapper.toDomain(model)
  }

  /**
   * Obtiene todas las categorías de la base de datos.
   * @returns Un arreglo de entidades Category.
   */
  async findAll(): Promise<Category[]> {
    const models = await CategoryModel.findAll()
    return models.map((m) => CategoryMapper.toDomain(m))
  }

  /**
   * Busca una categoría verificando el nombre exacto. Útil para validaciones.
   * @param name - Nombre a buscar.
   */
  async findByName(name: string): Promise<Category | null> {
    const model = await CategoryModel.findOne({ where: { name } })
    if (!model) return null
    return CategoryMapper.toDomain(model)
  }

  /**
   * Inserta una nueva categoría o actualiza una existente (Upsert implícito manual).
   * @param category - La entidad Category a guardar.
   */
  async save(category: Category): Promise<void> {
    const rawData = CategoryMapper.toPersistence(category)
    
    // Verificamos si ya existe para decidir si hacemos Update o Create
    const existing = await CategoryModel.findByPk(category.id)
    
    if (existing) {
      // Actualiza si existe
      await existing.update(rawData)
    } else {
      // Crea si es nueva
      await CategoryModel.create(rawData)
    }
  }

  /**
   * Elimina un registro de categoría de la BD.
   * @param id - Identificador de la categoría
   */
  async delete(id: string): Promise<void> {
    await CategoryModel.destroy({ where: { id } })
  }
}
