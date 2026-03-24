import { Category } from '@/menu/entities/Category'
import { ICategoryRepository } from '@/menu/repositories/interfaces/ICategoryRepository'

export class ActualizarCategoria {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  /**
   * Actualiza el nombre de una categoría existente.
   * @param id - ID de la categoría a actualizar
   * @param newName - El nuevo nombre
   * @returns La categoría actualizada
   */
  async execute(id: string, newName: string): Promise<Category> {
    // 1. Verificamos que la categoría exista
    const category = await this.categoryRepository.findById(id)
    if (!category) {
      throw new Error('Categoría no encontrada')
    }

    // 2. Validamos que el nuevo nombre no esté siendo usado por otra categoría distinto
    const existingName = await this.categoryRepository.findByName(newName)
    if (existingName && existingName.id !== id) {
      throw new Error('El nombre de la categoría ya está en uso')
    }

    // 3. Aplicamos la lógica de negocio a la entidad
    category.updateName(newName)

    // 4. Guardamos los cambios
    await this.categoryRepository.save(category)

    return category
  }
}
