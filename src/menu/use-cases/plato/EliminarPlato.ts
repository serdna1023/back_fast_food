import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'

export class EliminarPlato {
  constructor(private readonly platoRepository: IPlatoRepository) {}

  /**
   * Elimina un plato específico asegurándose de que antes existía.
   * @param id - ID del plato a eliminar
   */
  async execute(id: string, restaurantId: string): Promise<void> {
    const plato = await this.platoRepository.findById(id, restaurantId)
    if (!plato) {
      throw new Error('Plato no encontrado o acceso denegado')
    }

    await this.platoRepository.delete(id, restaurantId)
  }
}
