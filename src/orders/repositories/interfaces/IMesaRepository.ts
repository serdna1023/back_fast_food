import { Mesa } from '../../entities/Mesa'

export interface IMesaRepository {
  findById(mesaId: string, restaurantId: string): Promise<Mesa | null>
  save(mesa: Mesa): Promise<void>
}
