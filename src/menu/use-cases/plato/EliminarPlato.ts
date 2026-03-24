import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'

export class EliminarPlato {
  constructor(private readonly platoRepository: IPlatoRepository) {}

  /**
   * Elimina un plato específico asegurándose de que antes existía.
   * @param id - ID del plato a eliminar
   */
  async execute(id: string): Promise<void> {
    const plato = await this.platoRepository.findById(id)
    if (!plato) {
      throw new Error('Plato no encontrado')
    }

    await this.platoRepository.delete(id)
  }
}
