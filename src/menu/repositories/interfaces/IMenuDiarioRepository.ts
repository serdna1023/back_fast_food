import { MenuDiario } from '@/menu/entities/MenuDiario'

export interface IMenuDiarioRepository {
  /**
   * Guarda un menú diario y sus platos asociados en una sola transacción.
   */
  save(menu: MenuDiario): Promise<void>
  
  /**
   * Busca un menú por ID, recuperando también sus platos.
   */
  findById(id: string, restaurantId: string): Promise<MenuDiario | null>
  
  /**
   * Busca el menú de una fecha específica.
   */
  findByDate(date: Date, restaurantId: string): Promise<MenuDiario | null>
  
  /**
   * Lista los menús recientes.
   */
  findAll(restaurantId: string): Promise<MenuDiario[]>

  /**
   * Elimina un menú y sus detalles.
   */
  delete(id: string, restaurantId: string): Promise<void>
}
