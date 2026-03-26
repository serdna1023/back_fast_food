import { IMesaRepository } from '../repositories/interfaces/IMesaRepository'

export class UnirMesas {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async execute(mesaId: string, restaurantId: string, parentMesaId: string): Promise<void> {
    const mesa = await this.mesaRepository.findById(mesaId, restaurantId)
    if (!mesa) throw new Error(`La mesa ${mesaId} no existe`)

    const mesaMaestra = await this.mesaRepository.findById(parentMesaId, restaurantId)
    if (!mesaMaestra) throw new Error(`La mesa maestra ${parentMesaId} no existe`)

    // Si la mesa maestra ya es hija de otra, unir a la raíz para evitar cadenas
    const targetParentId = mesaMaestra.parentMesaId || parentMesaId

    mesa.unirA(targetParentId)
    await this.mesaRepository.save(mesa)
  }
}
