import { Plato } from '@/menu/entities/Plato'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'
import { ICategoryRepository } from '@/menu/repositories/interfaces/ICategoryRepository'

import { ActualizarPlatoDTO } from '../../dtos/ActualizarPlatoDTO';

export class ActualizarPlato {
  constructor(
    private readonly platoRepository: IPlatoRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  /**
   * Actualiza los datos de un plato existente.
   * @param dto - Datos del plato que se desean actualizar
   * @returns El plato actualizado
   */
  async execute(dto: ActualizarPlatoDTO): Promise<Plato> {
    const plato = await this.platoRepository.findById(dto.id, dto.restaurantId)
    if (!plato) {
      throw new Error('Plato no encontrado o acceso denegado')
    }

    // Actualizamos el tipo si se manda
    if (dto.tipo !== undefined) {
       plato.tipo = dto.tipo
    }

    // Si se envía una categoryId nueva, validamos que la categoría de destino exista en el mismo restaurante.
    if (dto.categoryId && dto.categoryId !== plato.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId, dto.restaurantId)
      if (!category) {
        throw new Error('La nueva categoría especificada no existe o no pertenece al mismo restaurante')
      }
      plato.categoryId = dto.categoryId
    }

    // Actualizamos detalles visuales/informativos
    if (dto.name !== undefined || dto.description !== undefined || dto.imageUrl !== undefined) {
      plato.updateDetails(
        dto.name ?? plato.name,
        dto.description === undefined ? plato.description : dto.description,
        dto.imageUrl === undefined ? plato.imageUrl : dto.imageUrl
      )
    }

    // Actualizamos precio usando la lógica de dominio (que ya maneja CARTA vs MENU)
    if (dto.price !== undefined && dto.price !== plato.price) {
      plato.updatePrice(dto.price)
    }

    // Actualizamos disponibilidad
    if (dto.available !== undefined && dto.available !== plato.available) {
      plato.available = dto.available 
      plato.updatedAt = new Date()
    }

    // Persistimos los cambios
    await this.platoRepository.save(plato)

    return plato
  }
}
