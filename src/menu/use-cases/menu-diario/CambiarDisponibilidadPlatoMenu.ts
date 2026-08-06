import { IMenuDiarioRepository } from '@/menu/repositories/interfaces/IMenuDiarioRepository'

export class CambiarDisponibilidadPlatoMenu {
  constructor(private readonly menuDiarioRepository: IMenuDiarioRepository) {}

  /**
   * @param menuId - ID del menú diario
   * @param detalleId - ID del registro en la tabla intermedia
   * @param disponible - Nuevo estado
   */
  async execute(menuId: string, restaurantId: string, detalleId: string, disponible: boolean): Promise<void> {
    const menu = await this.menuDiarioRepository.findById(menuId, restaurantId)
    if (!menu) throw new Error('Menú diario no encontrado o acceso denegado')

    menu.cambiarDisponibilidadPlato(detalleId, disponible)

    await this.menuDiarioRepository.save(menu)
  }
}
