import { v4 as uuidv4 } from 'uuid'

export type TipoTiempo = 'ENTRADA' | 'SEGUNDO'

/**
 * Representa la asociación de un plato específico dentro de un menú diario.
 */
export class MenuPlatoDetalle {
  constructor(
    public readonly id: string,
    public readonly menuDiarioId: string,
    public readonly platoId: string, // ID del Plato (tipo MENU)
    public readonly tipoTiempo: TipoTiempo,
    public disponible: boolean = true,
    public readonly platoName?: string, // Opcional, para facilitar lectura en el dominio
    public readonly platoImageUrl?: string | null
  ) {}
}

/**
 * Entidad de dominio que representa la oferta de menú completo para un día específico.
 */
export class MenuDiario {
  constructor(
    public readonly id: string,
    public precio: number,
    public fecha: Date,
    public creadoPor: string, // User ID del admin/empleado
    public platos: MenuPlatoDetalle[] = [],
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    if (precio < 0) throw new Error('El precio del menú no puede ser negativo')
  }

  /**
   * Agrega un plato a la oferta del día.
   */
  agregarPlato(platoId: string, tipoTiempo: TipoTiempo, disponible: boolean = true): void {
    const detalle = new MenuPlatoDetalle(
      uuidv4(),
      this.id,
      platoId,
      tipoTiempo,
      disponible
    )
    this.platos.push(detalle)
    this.updatedAt = new Date()
  }

  /**
   * Cambia la disponibilidad de un plato específico en la oferta.
   */
  cambiarDisponibilidadPlato(detalleId: string, disponible: boolean): void {
    const plato = this.platos.find(p => p.id === detalleId)
    if (!plato) throw new Error('Plato no encontrado en este menú diario')
    plato.disponible = disponible
    this.updatedAt = new Date()
  }

  /**
   * Limpia la lista de platos (útil para actualizaciones).
   */
  limpiarPlatos(): void {
    this.platos = []
    this.updatedAt = new Date()
  }
}
