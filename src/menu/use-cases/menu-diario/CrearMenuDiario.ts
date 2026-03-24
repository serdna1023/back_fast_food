import { MenuDiario, TipoTiempo } from '@/menu/entities/MenuDiario'
import { IMenuDiarioRepository } from '@/menu/repositories/interfaces/IMenuDiarioRepository'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'
import { v4 as uuidv4 } from 'uuid'

export interface PlatoMenuInput {
  platoId: string
  tipoTiempo: TipoTiempo
}

export interface CrearMenuDiarioDTO {
  precio: number
  fecha?: Date
  creadoPor: string
  platos: PlatoMenuInput[]
}

export class CrearMenuDiario {
  constructor(
    private readonly menuDiarioRepository: IMenuDiarioRepository,
    private readonly platoRepository: IPlatoRepository
  ) {}

  async execute(dto: CrearMenuDiarioDTO): Promise<MenuDiario> {
    if (!dto.platos || dto.platos.length === 0) {
      throw new Error('El menú diario debe tener al menos un plato')
    }

    // 1. Validar que todos los platos existan y sean de tipo 'MENU'
    for (const item of dto.platos) {
      const plato = await this.platoRepository.findById(item.platoId)
      if (!plato) {
        throw new Error(`El plato con ID ${item.platoId} no existe`)
      }
      if (plato.tipo !== 'MENU') {
        throw new Error(`El plato "${plato.name}" no es de tipo MENU y no puede estar en la oferta diaria`)
      }
    }

    // 2. Crear la entidad principal
    const menu = new MenuDiario(
      uuidv4(),
      dto.precio,
      dto.fecha || new Date(),
      dto.creadoPor
    )

    // 3. Agregar los detalles
    for (const item of dto.platos) {
      menu.agregarPlato(item.platoId, item.tipoTiempo)
    }

    // 4. Guardar
    await this.menuDiarioRepository.save(menu)

    return menu
  }
}
