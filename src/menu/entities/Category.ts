export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly createdAt: Date
  ) {}

  // Reglas de negocio puras
  /**
   * Actualiza el nombre de la categoría, aplicando reglas de validación.
   * @param newName - El nuevo nombre a asignar
   */
  updateName(newName: string): void {
    if (!newName || newName.trim().length < 3) {
      throw new Error('El nombre de la categoría debe tener al menos 3 caracteres')
    }
    this.name = newName.trim()
  }
}
