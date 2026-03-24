import { Category } from '@/menu/entities/Category'
import { CategoryModel } from '@/SequelizeModels'

export class CategoryMapper {
  static toDomain(model: CategoryModel): Category {
    return new Category(
      model.id,
      model.name,
      model.createdAt
    )
  }

  static toPersistence(entity: Category): any {
    return {
      id: entity.id,
      name: entity.name,
      // Date is managed by DB mostly, but we can pass it
      created_at: entity.createdAt
    }
  }
}
