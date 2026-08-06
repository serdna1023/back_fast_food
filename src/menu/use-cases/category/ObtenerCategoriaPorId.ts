import { Category } from '@/menu/entities/Category'
import { ICategoryRepository } from '@/menu/repositories/interfaces/ICategoryRepository'

export class ObtenerCategoriaPorId {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  /**
   * Busca y retorna una categoría por su ID.
   * @param id - Identificador único de la categoría.
   * @returns La categoría si existe, o null.
   * @throws Error si no se encuentra (dependiendo del diseño, acá elegimos arrojar error para casos de uso estrictos)
   */
  async execute(id: string, restaurantId: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id, restaurantId)
    
    if (!category) {
      throw new Error('Categoría no encontrada o acceso denegado')
    }

    return category
  }
}
