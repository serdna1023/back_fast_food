import { Mesa } from '../entities/Mesa'
import { IMesaRepository } from '../repositories/interfaces/IMesaRepository'

export class CrearMesa {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async execute(params: {
    id: string
    restaurantId: string
    capacidad: number
  }): Promise<void> {
    const mesa = new Mesa(
      params.id,
      params.restaurantId,
      'FREE',
      null,
      null,
      true,
      params.capacidad
    )

    await this.mesaRepository.save(mesa)
  }
}
