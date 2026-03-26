export type MesaStatus = 'FREE' | 'WAITING' | 'OCCUPIED'

export class Mesa {
  constructor(
    public readonly id: string,
    public readonly restaurantId: string,
    public status: MesaStatus,
    public currentOrderId: string | null = null,
    public parentMesaId: string | null = null,
    public readonly isActive: boolean = true
  ) {}

  // ─── Métodos de dominio ────────────────────────────────────────

  /** El mesero aprobó el check-in: la mesa pasa a OCCUPIED y se le asigna una orden */
  ocupar(orderId: string): void {
    if (!this.isActive) throw new Error('La mesa está inactiva')
    if (this.status === 'OCCUPIED') throw new Error(`La mesa ${this.id} ya está ocupada`)
    this.status = 'OCCUPIED'
    this.currentOrderId = orderId
  }

  /** El cliente escanea el QR: la mesa pasa a WAITING (esperando aprobación del mesero) */
  ponerEnEspera(): void {
    if (!this.isActive) throw new Error('La mesa está inactiva')
    if (this.status === 'OCCUPIED') throw new Error(`La mesa ${this.id} ya está en uso`)
    this.status = 'WAITING'
  }

  /** Al pagar la cuenta: la mesa queda FREE y se limpia la orden */
  liberar(): void {
    this.status = 'FREE'
    this.currentOrderId = null
    this.parentMesaId = null // También se desune si estaba unida
  }

  /** Une esta mesa como "hija" de una mesa maestra (para combinar comensales) */
  unirA(mesaMaestraId: string): void {
    if (this.id === mesaMaestraId) throw new Error('No puedes unir una mesa a sí misma')
    if (this.status === 'OCCUPIED') throw new Error(`La mesa ${this.id} ya tiene comensales, no se puede unir`)
    this.parentMesaId = mesaMaestraId
  }

  /** Separa esta mesa de su mesa maestra */
  separar(): void {
    this.parentMesaId = null
  }

  // ─── Consultas ─────────────────────────────────────────────────

  get estaLibre(): boolean {
    return this.status === 'FREE'
  }

  get estaOcupada(): boolean {
    return this.status === 'OCCUPIED'
  }

  get estaEnEspera(): boolean {
    return this.status === 'WAITING'
  }

  get estaUnida(): boolean {
    return this.parentMesaId !== null
  }
}
