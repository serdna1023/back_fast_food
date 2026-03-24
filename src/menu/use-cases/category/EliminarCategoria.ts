import { ICategoryRepository } from '@/menu/repositories/interfaces/ICategoryRepository'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'

export class EliminarCategoria {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly platoRepository: IPlatoRepository
  ) {}

  /**
   * Elimina una categoría asegurando reglas de integridad.
   * @param id - ID de la categoría a eliminar
   */
  async execute(id: string): Promise<void> {
    // 1. Verificamos que exista
    const category = await this.categoryRepository.findById(id)
    if (!category) {
      throw new Error('Categoría no encontrada')
    }

    // 2. Verificamos integridad referencial (ej: no eliminar si tiene platos asociados)
    const items = await this.platoRepository.findByCategory(id)
    if (items.length > 0) {
      throw new Error('No se puede eliminar la categoría porque tiene platos asociados')
    }

    // 3. Eliminamos
    await this.categoryRepository.delete(id)
  }
}
