import { Plato } from '@/menu/entities/Plato'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'
import { ICategoryRepository } from '@/menu/repositories/interfaces/ICategoryRepository'

export class ListarPlatosPorCategoria {
  constructor(
    private readonly platoRepository: IPlatoRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  /**
   * Devuelve todos los platos que pertenecen a una categoría específica.
   */
  async execute(categoryId: string): Promise<Plato[]> {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) {
      throw new Error('Categoría no encontrada')
    }

    return this.platoRepository.findByCategory(categoryId)
  }
}
