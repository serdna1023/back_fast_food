import { OrderItem } from './OrderItem'

export type OrderStatus = 'PENDIENTE' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO'
export type OrderModalidad = 'MESA' | 'LLEVAR'
export type PaymentStatus = 'PENDIENTE' | 'PAGADO'

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
    public readonly customerName: string | null,
    public readonly mesaId: string | null,
    public readonly modalidad: OrderModalidad,
    public estado: OrderStatus,
    public pagoEstado: PaymentStatus,
    public readonly items: OrderItem[] = [],
    public readonly total: number = 0,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  /**
   * Calcula el total real basado en los items actuales.
   */
  calcularTotal(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0)
  }

  /**
   * Solo pedidos en PENDIENTE pueden ser cancelados por el usuario.
   */
  puedeCancelarse(): boolean {
    return this.estado === 'PENDIENTE'
  }

  cancelar(): void {
    if (!this.puedeCancelarse()) {
      throw new Error('No se puede cancelar un pedido que ya está en preparación o entregado')
    }
    this.estado = 'CANCELADO'
    this.updatedAt = new Date()
  }

  marcarComoPreparando(): void {
    if (this.estado !== 'PENDIENTE') throw new Error('Solo se pueden preparar pedidos pendientes')
    this.estado = 'PREPARANDO'
    this.updatedAt = new Date()
  }

  marcarComoListo(): void {
    if (this.estado !== 'PREPARANDO') throw new Error('El pedido debe estar en preparación para marcarlo como listo')
    this.estado = 'LISTO'
    this.updatedAt = new Date()
  }

  marcarComoEntregado(): void {
    if (this.estado !== 'LISTO' && this.modalidad === 'LLEVAR') {
       // Para llevar suele pasar de LISTO a ENTREGADO
    }
    this.estado = 'ENTREGADO'
    this.updatedAt = new Date()
  }

  marcarComoPagado(): void {
    this.pagoEstado = 'PAGADO'
    this.updatedAt = new Date()
  }
}
