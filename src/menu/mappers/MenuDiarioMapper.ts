import { MenuDiario, MenuPlatoDetalle, TipoTiempo } from '@/menu/entities/MenuDiario'
import { MenuDiarioModel, MenuPlatoModel, PlatoModel } from '@/SequelizeModels'

export class MenuDiarioMapper {
  static toDomain(model: MenuDiarioModel): MenuDiario {
    const platos = model.platos?.map((p: MenuPlatoModel) => new MenuPlatoDetalle(
      p.id,
      p.menuDiarioId,
      p.platoId,
      p.tipoTiempo as TipoTiempo,
      p.disponible,
      p.plato?.name,
      p.plato?.imageUrl
    )) || []

    return new MenuDiario(
      model.id,
      parseFloat(model.precio.toString()),
      model.fecha,
      model.creadoPor,
      platos,
      model.createdAt,
      model.updatedAt
    )
  }

  static toPersistence(entity: MenuDiario): any {
    return {
      id: entity.id,
      precio: entity.precio,
      fecha: entity.fecha,
      creado_por: entity.creadoPor,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    }
  }

  static toPersistenceDetalle(detalle: MenuPlatoDetalle): any {
    return {
      id: detalle.id,
      menu_diario_id: detalle.menuDiarioId,
      plato_id: detalle.platoId,
      tipo_tiempo: detalle.tipoTiempo,
      disponible: detalle.disponible
    }
  }
}
