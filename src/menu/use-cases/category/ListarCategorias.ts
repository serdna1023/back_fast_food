import { Category } from '@/menu/entities/Category'
import { ICategoryRepository } from '@/menu/repositories/interfaces/ICategoryRepository'

export class ListarCategorias {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  /**
   * Obtiene la lista completa de todas las categorías.
   * @returns Un arreglo con todas las categorías en el sistema.
   */
  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll()
  }
}
