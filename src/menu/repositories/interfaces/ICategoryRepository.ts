import { Category } from '@/menu/entities/Category'

export interface ICategoryRepository {
  findById(id: string, restaurantId: string): Promise<Category | null>
  findAll(restaurantId: string): Promise<Category[]>
  findByName(name: string, restaurantId: string): Promise<Category | null>
  save(category: Category): Promise<void>
  delete(id: string, restaurantId: string): Promise<void>
}
