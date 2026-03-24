import { Plato } from '@/menu/entities/Plato'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'

/**
 * Caso de uso para buscar platos por nombre (búsqueda parcial).
 */
export class BuscarPlatosPorNombre {
  constructor(private readonly platoRepository: IPlatoRepository) {}

  /**
   * Busca platos cuyo nombre contenga el texto indicado.
   * @param query - Texto parcial a buscar
   * @returns Arreglo de platos que coinciden con la búsqueda
   */
  async execute(query: string): Promise<Plato[]> {
    if (!query || query.trim().length === 0) {
      return []
    }

    return this.platoRepository.searchByName(query.trim())
  }
}
