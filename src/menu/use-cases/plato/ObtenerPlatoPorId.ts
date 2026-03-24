import { Plato } from '@/menu/entities/Plato'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'

export class ObtenerPlatoPorId {
  constructor(private readonly platoRepository: IPlatoRepository) {}

  /**
   * Obtiene un plato en específico por su identificador.
   * @param id - Identificador único del plato
   * @returns El plato encontrado
   */
  async execute(id: string): Promise<Plato> {
    const plato = await this.platoRepository.findById(id)
    
    if (!plato) {
      throw new Error('Plato no encontrado')
    }

    return plato
  }
}
