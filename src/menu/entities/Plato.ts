export class Plato {
  constructor(
    public readonly id: string,
    public categoryId: string,
    public name: string,
    public description: string | null,
    public tipo: 'CARTA' | 'MENU',
    public price: number | null,
    public imageUrl: string | null,
    public available: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    if (this.tipo === 'CARTA' && (this.price === null || this.price <= 0)) {
      throw new Error('Un plato a la carta debe tener un precio mayor a cero.')
    }
    if (this.tipo === 'MENU') {
      this.price = null
    }
  }

  // Reglas de negocio puras
  updatePrice(newPrice: number | null): void {
    if (this.tipo === 'CARTA' && (newPrice === null || newPrice <= 0)) {
       throw new Error('El precio no puede ser negativo ni nulo para platos a la carta')
    }
    this.price = this.tipo === 'MENU' ? null : newPrice
    this.updatedAt = new Date()
  }

  toggleAvailability(): void {
    this.available = !this.available
    this.updatedAt = new Date()
  }

  updateDetails(name: string, description: string | null, imageUrl: string | null): void {
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.updatedAt = new Date()
  }
}
