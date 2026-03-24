import { Category } from '@/menu/entities/Category'

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>
  findAll(): Promise<Category[]>
  findByName(name: string): Promise<Category | null>
  save(category: Category): Promise<void>
  delete(id: string): Promise<void>
}
