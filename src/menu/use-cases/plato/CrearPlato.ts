import { Plato } from '@/menu/entities/Plato'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'
import { ICategoryRepository } from '@/menu/repositories/interfaces/ICategoryRepository'
import { v4 as uuidv4 } from 'uuid'

export interface CrearPlatoDTO {
  categoryId: string
  name: string
  description?: string | null
  tipo: 'CARTA' | 'MENU'
  price?: number | null
  imageUrl?: string | null
  available?: boolean
}

export class CrearPlato {
  constructor(
    private readonly platoRepository: IPlatoRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  /**
   * Crea un nuevo plato (Carta o Menú).
   * @param dto - Datos para la creación del plato
   * @returns El plato creado
   */
  async execute(dto: CrearPlatoDTO): Promise<Plato> {
    // 1. Verificamos que la categoría asociada exista
    const category = await this.categoryRepository.findById(dto.categoryId)
    if (!category) {
      throw new Error('La categoría especificada no existe')
    }

    // 2. Creamos la entidad Plato
    const nuevoPlato = new Plato(
      uuidv4(),
      dto.categoryId,
      dto.name,
      dto.description ?? null,
      dto.tipo,
      dto.price ?? null,
      dto.imageUrl ?? null,
      dto.available ?? true,
      new Date(),
      new Date()
    )

    // 3. Guardamos el plato usando su repositorio correspondiente
    await this.platoRepository.save(nuevoPlato)

    return nuevoPlato
  }
}
