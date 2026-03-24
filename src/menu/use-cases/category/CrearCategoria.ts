import { Category } from '@/menu/entities/Category'
import { ICategoryRepository } from '@/menu/repositories/interfaces/ICategoryRepository'
import { v4 as uuidv4 } from 'uuid'

export class CrearCategoria {
  /**
   * Inyectamos el repositorio para no depender de una base de datos específica.
   */
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  /**
   * Ejecuta el caso de uso para crear una nueva categoría.
   * @param name - Nombre de la nueva categoría
   * @returns La categoría creada
   */
  async execute(name: string): Promise<Category> {
    // 1. Verificamos si ya existe una categoría con ese nombre
    const existingCategory = await this.categoryRepository.findByName(name)
    if (existingCategory) {
      throw new Error('Ya existe una categoría con ese nombre')
    }

    // 2. Creamos la entidad
    // (Asumimos que el ID se genera acá para tenerlo disponible inmediatamente)
    const newCategory = new Category(
      uuidv4(),
      name,
      new Date()
    )

    // Validamos reglas de negocio iniciales (si aplica)
    newCategory.updateName(name) // Para forzar la validación de longitud

    // 3. Guardamos usando el repositorio
    await this.categoryRepository.save(newCategory)

    // 4. Retornamos la entidad
    return newCategory
  }
}
