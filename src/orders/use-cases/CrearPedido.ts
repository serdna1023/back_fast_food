import { v4 as uuidv4 } from 'uuid'
import { IOrderRepository } from '@/orders/repositories/interfaces/IOrderRepository'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'
import { IMenuDiarioRepository } from '@/menu/repositories/interfaces/IMenuDiarioRepository'
import { Order, OrderModalidad } from '@/orders/entities/Order'
import { OrderItem } from '@/orders/entities/OrderItem'
import { getSocket } from '@/shared/infrastructure/websocket/socket.server'
import { MesaModel } from '@/SequelizeModels'
import { CrearPedidoDTO, ItemPedidoInput } from '../dtos/CrearPedidoDTO'

export class CrearPedido {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly platoRepository: IPlatoRepository,
    private readonly menuDiarioRepository: IMenuDiarioRepository
  ) {}

  async execute(dto: CrearPedidoDTO): Promise<Order> {
    if (dto.items.length === 0) throw new Error('El pedido debe tener al menos un item')

    // Lógica de Redirección de Mesas (Mesas Unidas)
    let mesaIdFinal = dto.mesaId || null
    if (mesaIdFinal) {
      const mesa = await MesaModel.findOne({
        where: { id: mesaIdFinal, restaurantId: dto.restaurantId }
      })
      if (mesa && mesa.parentMesaId) {
        mesaIdFinal = mesa.parentMesaId
        console.log(`🔀 Redirigiendo pedido de Mesa ${dto.mesaId} a Mesa Maestra ${mesaIdFinal}`)
      }
    }

    // === CUENTA ABIERTA: Buscar orden existente o crear nueva ===
    let existingOrder: Order | null = null

    // Prioridad 1: Si viene un orderId explícito (del GuestToken)
    if (dto.orderId) {
      existingOrder = await this.orderRepository.findById(dto.orderId)
      if (!existingOrder || existingOrder.pagoEstado === 'PAGADO') {
        existingOrder = null // La orden ya fue pagada, crear una nueva
      }
    }

    // Prioridad 2: Buscar por mesa activa si no hay orderId
    if (!existingOrder && mesaIdFinal) {
      const pedidosMesa = await this.orderRepository.findByMesa(mesaIdFinal, true)
      if (pedidosMesa.length > 0) {
        existingOrder = pedidosMesa[0] // Usar la primera orden activa
      }
    }

    const orderId = existingOrder?.id || uuidv4()
    const newItems: OrderItem[] = []

    for (const item of dto.items) {
      let precioUnitario = 0
      let nombrePlato = ''

      if (item.platoId) {
        const plato = await this.platoRepository.findById(item.platoId)
        if (!plato) throw new Error(`Plato con ID ${item.platoId} no encontrado`)
        if (plato.tipo !== 'CARTA') throw new Error(`El plato ${plato.name} debe ser de tipo CARTA para venderse individualmente`)
        precioUnitario = plato.price || 0
        nombrePlato = plato.name
      } else if (item.diarioId) {
        const diario = await this.menuDiarioRepository.findById(item.diarioId)
        if (!diario) throw new Error(`Menú diario con ID ${item.diarioId} no encontrado`)
        precioUnitario = diario.precio
        nombrePlato = 'Menú del Día'
      } else {
        throw new Error('Cada item debe tener platoId o diarioId')
      }

      const orderItem = new OrderItem(
        uuidv4(),
        orderId,
        item.platoId || null,
        item.diarioId || null,
        item.cantidad,
        precioUnitario,
        item.notas,
        nombrePlato
      )
      newItems.push(orderItem)
    }

    // === Si hay orden existente, SUMAR items ===
    if (existingOrder) {
      const allItems = [...existingOrder.items, ...newItems]
      const newTotal = allItems.reduce((sum, i) => sum + i.subtotal, 0)

      const updatedOrder = new Order(
        existingOrder.id,
        existingOrder.userId,
        existingOrder.customerName,
        existingOrder.mesaId,
        existingOrder.modalidad,
        existingOrder.estado,
        existingOrder.pagoEstado,
        allItems,
        newTotal,
        existingOrder.createdAt,
        new Date(),
        dto.restaurantId
      )

      await this.orderRepository.save(updatedOrder)

      // Notificación
      try {
        const io = getSocket()
        io.to(`restaurant_${dto.restaurantId}`).emit('items_agregados', {
          orderId: updatedOrder.id,
          mesaId: updatedOrder.mesaId,
          nuevosItems: newItems.length,
          totalActualizado: updatedOrder.total
        })
      } catch (e) {
        console.warn('Socket no inicializado')
      }

      return updatedOrder
    }

    // === Si NO hay orden, CREAR una nueva ===
    const total = newItems.reduce((sum, i) => sum + i.subtotal, 0)

    const order = new Order(
      orderId,
      dto.userId || null,
      dto.customerName || 'Cliente Invitado',
      mesaIdFinal,
      dto.modalidad,
      'PENDIENTE',
      'PENDIENTE',
      newItems,
      total,
      new Date(),
      new Date(),
      dto.restaurantId
    )

    await this.orderRepository.save(order)

    // Notificación en Tiempo Real
    try {
      const io = getSocket()
      io.to(`restaurant_${dto.restaurantId}`).emit('nuevo_pedido', {
        id: order.id,
        mesaId: order.mesaId,
        total: order.total,
        items: newItems.length
      })
    } catch (e) {
      console.warn('Socket no inicializado')
    }

    return order
  }
}
