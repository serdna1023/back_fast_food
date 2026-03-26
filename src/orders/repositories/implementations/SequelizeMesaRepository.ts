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
      model.isActive
    )
  }

  async save(mesa: Mesa): Promise<void> {
    await MesaModel.update(
      {
        status: mesa.status,
        currentOrderId: mesa.currentOrderId,
        parentMesaId: mesa.parentMesaId,
      },
      { where: { id: mesa.id, restaurantId: mesa.restaurantId } }
    )
  }
}
