import { MesaModel } from '@/SequelizeModels'
import { Mesa } from '../../entities/Mesa'
import { IMesaRepository } from '../interfaces/IMesaRepository'

export class SequelizeMesaRepository implements IMesaRepository {
  async findById(mesaId: string, restaurantId: string): Promise<Mesa | null> {
    const model = await MesaModel.findOne({
      where: { id: mesaId, restaurantId }
    })
    if (!model) return null

    return new Mesa(
      model.id,
      model.restaurantId,
      model.status,
      model.currentOrderId,
      model.parentMesaId,
      model.isActive,
      model.capacidad
    )
  }

  async save(mesa: Mesa): Promise<void> {
    await MesaModel.upsert({
      id: mesa.id,
      restaurantId: mesa.restaurantId,
      status: mesa.status,
      currentOrderId: mesa.currentOrderId,
      parentMesaId: mesa.parentMesaId,
      isActive: mesa.isActive,
      capacidad: mesa.capacidad
    })
  }
}
