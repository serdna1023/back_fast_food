import { OrderStatus } from './Order'

export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly platoId: string | null,
    public readonly diarioId: string | null,
    public readonly cantidad: number,
    public readonly precioUnitario: number,
    public readonly notas?: string | null,
    public readonly platoName?: string, // Opcional para facilitar lectura en el dominio
    public readonly platoImageUrl?: string | null,
    public estado: OrderStatus = 'PENDIENTE'
  ) {
    if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a cero')
    if (precioUnitario < 0) throw new Error('El precio no puede ser negativo')
    if (!platoId && !diarioId) throw new Error('El item debe tener un plato o un menú diario vinculado')
    if (platoId && diarioId) throw new Error('Un item no puede ser simultáneamente un plato y un menú diario')
  }

  get subtotal(): number {
    return this.cantidad * this.precioUnitario
  }
}
