import { TipoTiempo } from '../entities/MenuDiario';

export interface PlatoMenuInput {
  platoId: string
  tipoTiempo: TipoTiempo
}

export interface CrearMenuDiarioDTO {
  restaurantId: string;
  precio: number
  fecha?: Date
  creadoPor: string
  platos: PlatoMenuInput[]
}
