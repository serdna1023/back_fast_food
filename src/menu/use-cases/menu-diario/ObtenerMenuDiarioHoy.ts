import { MenuDiario } from '@/menu/entities/MenuDiario'
import { IMenuDiarioRepository } from '@/menu/repositories/interfaces/IMenuDiarioRepository'

export class ObtenerMenuDiarioHoy {
  constructor(private readonly menuDiarioRepository: IMenuDiarioRepository) {}

  async execute(): Promise<MenuDiario | null> {
    // Para simplificar, buscamos por la fecha de hoy (sin hora)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    return this.menuDiarioRepository.findByDate(hoy)
  }
}
