import { Plato } from '@/menu/entities/Plato'
import { PlatoModel } from '@/SequelizeModels'

export class PlatoMapper {
  static toDomain(model: PlatoModel): Plato {
    return new Plato(
      model.id,
      model.restaurantId,
      model.categoryId,
      model.name,
      model.description,
      model.tipo as 'CARTA' | 'MENU',
      model.price ? parseFloat(model.price.toString()) : null,
      model.imageUrl,
      model.available,
      model.createdAt,
      model.updatedAt
    )
  }

  static toPersistence(entity: Plato): any {
    return {
      id: entity.id,
      restaurant_id: entity.restaurantId,
      category_id: entity.categoryId,
      name: entity.name,
      description: entity.description,
      tipo: entity.tipo,
      price: entity.price,
      image_url: entity.imageUrl,
      available: entity.available,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    }
  }
}
