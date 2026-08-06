import { Plato } from '@/menu/entities/Plato'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'

export class ObtenerPlatoPorId {
  constructor(private readonly platoRepository: IPlatoRepository) {}

  /**
   * Obtiene un plato en específico por su identificador.
   * @param id - Identificador único del plato
   * @returns El plato encontrado
   */
  async execute(id: string, restaurantId: string): Promise<Plato> {
    const plato = await this.platoRepository.findById(id, restaurantId)
    
    if (!plato) {
      throw new Error('Plato no encontrado o acceso denegado')
    }

    return plato
  }
}
