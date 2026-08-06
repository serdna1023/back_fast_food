import { IRestauranteRepository } from '../repositories/interfaces/IRestauranteRepository'
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository'
import { IPlatoRepository } from '../repositories/interfaces/IPlatoRepository'
import { IMenuDiarioRepository } from '../repositories/interfaces/IMenuDiarioRepository'

export class ObtenerMenuPublico {
  constructor(
    private readonly restauranteRepository: IRestauranteRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly platoRepository: IPlatoRepository,
    private readonly menuDiarioRepository: IMenuDiarioRepository
  ) {}

  async execute(slug: string) {
    const restaurante = await this.restauranteRepository.findBySlug(slug)
    if (!restaurante) throw new Error('Restaurante no encontrado')

    const [categories, platos, menuDiario] = await Promise.all([
      this.categoryRepository.findAll(restaurante.id),
      this.platoRepository.findAll(restaurante.id),
      this.menuDiarioRepository.findByDate(new Date(), restaurante.id)
    ])

    return {
      restaurante: {
        nombre: restaurante.nombre,
        slug: restaurante.slug
      },
      categories: categories.map(c => ({
        id: c.id,
        nombre: c.name
      })),
      platos: platos.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        categoryId: p.categoryId,
        imageUrl: p.imageUrl,
        available: p.available
      })),
      menuDiario: menuDiario ? {
        id: menuDiario.id,
        precio: menuDiario.precio,
        platos: menuDiario.platos
      } : null
    }
  }
}
