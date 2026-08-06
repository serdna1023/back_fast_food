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
    public readonly platoName?: string, 
    public readonly platoImageUrl?: string | null,
    public estado: OrderStatus = 'PENDIENTE',
    public readonly entradaId: string | null = null,
    public readonly segundoId: string | null = null,
    public readonly entradaName?: string,
    public readonly segundoName?: string
  ) {
    if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a cero')
    if (precioUnitario < 0) throw new Error('El precio no puede ser negativo')
    if (!platoId && !diarioId) throw new Error('El item debe tener un plato o un menú diario vinculado')
    if (platoId && diarioId) throw new Error('Un item no puede ser simultáneamente un plato y un menú diario')
    
    if (diarioId && (!entradaId || !segundoId)) {
        // En una implementación estricta, podríamos obligar a tener entrada y segundo 
        // pero lo dejamos opcional en el constructor para flexibilidad de carga desde DB
    }
  }

  get subtotal(): number {
    return this.cantidad * this.precioUnitario
  }
}
