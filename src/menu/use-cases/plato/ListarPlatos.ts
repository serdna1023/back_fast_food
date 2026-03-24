import { Plato } from '@/menu/entities/Plato'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'

export class ListarPlatos {
  constructor(private readonly platoRepository: IPlatoRepository) {}

  /**
   * Recupera todos los platos actuales.
   * @returns Un arreglo con todos los platos.
   */
  async execute(): Promise<Plato[]> {
    return this.platoRepository.findAll()
  }
}
