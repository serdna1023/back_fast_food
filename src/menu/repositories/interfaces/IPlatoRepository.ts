import { Plato } from '@/menu/entities/Plato'

export interface IPlatoRepository {
  findById(id: string): Promise<Plato | null>
  findByCategory(categoryId: string): Promise<Plato[]>
  findAll(): Promise<Plato[]>
  searchByName(query: string): Promise<Plato[]>
  save(plato: Plato): Promise<void>
  delete(id: string): Promise<void>
}
