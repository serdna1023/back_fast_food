import { RestauranteModel } from '@/SequelizeModels'
import { IRestauranteRepository } from '../interfaces/IRestauranteRepository'

export class SequelizeRestauranteRepository implements IRestauranteRepository {
  async findBySlug(slug: string): Promise<{ id: string; nombre: string; slug: string } | null> {
    const model = await RestauranteModel.findOne({ where: { slug, activo: true } })
    if (!model) return null

    return {
      id: model.id,
      nombre: model.nombre,
      slug: model.slug
    }
  }
}
