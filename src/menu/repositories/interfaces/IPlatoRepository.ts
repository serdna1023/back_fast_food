import { Plato } from '@/menu/entities/Plato'

export interface IPlatoRepository {
  findById(id: string, restaurantId: string): Promise<Plato | null>
  findByCategory(categoryId: string, restaurantId: string): Promise<Plato[]>
  findAll(restaurantId: string): Promise<Plato[]>
  searchByName(query: string, restaurantId: string): Promise<Plato[]>
  save(plato: Plato): Promise<void>
  delete(id: string, restaurantId: string): Promise<void>
}
