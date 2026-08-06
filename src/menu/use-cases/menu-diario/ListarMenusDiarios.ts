import { MenuDiario } from '@/menu/entities/MenuDiario'
import { IMenuDiarioRepository } from '@/menu/repositories/interfaces/IMenuDiarioRepository'

export class ListarMenusDiarios {
  constructor(private readonly menuDiarioRepository: IMenuDiarioRepository) {}

  async execute(restaurantId: string): Promise<MenuDiario[]> {
    return this.menuDiarioRepository.findAll(restaurantId)
  }
}
