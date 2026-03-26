import { IMesaRepository } from '../repositories/interfaces/IMesaRepository'

export class LiberarMesa {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async execute(mesaId: string, restaurantId: string): Promise<void> {
    const mesa = await this.mesaRepository.findById(mesaId, restaurantId)
    if (!mesa) throw new Error(`La mesa ${mesaId} no existe`)

    mesa.separar()
    await this.mesaRepository.save(mesa)
  }
}
