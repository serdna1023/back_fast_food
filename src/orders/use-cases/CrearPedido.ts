import { v4 as uuidv4 } from 'uuid'
import { IOrderRepository } from '@/orders/repositories/interfaces/IOrderRepository'
import { IPlatoRepository } from '@/menu/repositories/interfaces/IPlatoRepository'
import { IMenuDiarioRepository } from '@/menu/repositories/interfaces/IMenuDiarioRepository'
import { Order, OrderModalidad } from '@/orders/entities/Order'
import { OrderItem } from '@/orders/entities/OrderItem'
import { getSocket } from '@/shared/infrastructure/websocket/socket.server'
import { MesaModel } from '@/SequelizeModels'

export interface ItemPedidoInput {
  platoId?: string
  diarioId?: string
  cantidad: number
  notas?: string
}

export interface CrearPedidoDTO {
  userId?: string
  customerName?: string
  mesaId?: string
  modalidad: OrderModalidad
  items: ItemPedidoInput[]
}

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
      const mesa = await MesaModel.findByPk(mesaIdFinal)
      if (mesa && mesa.parentMesaId) {
        mesaIdFinal = mesa.parentMesaId
        console.log(`🔀 Redirigiendo pedido de Mesa ${dto.mesaId} a Mesa Maestra ${mesaIdFinal}`)
      }
    }

    const orderId = uuidv4()
    const orderItems: OrderItem[] = []

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
      orderItems.push(orderItem)
    }

    const total = orderItems.reduce((sum, i) => sum + i.subtotal, 0)

    const order = new Order(
      orderId,
      dto.userId || null,
      dto.customerName || 'Cliente Invitado',
      mesaIdFinal,
      dto.modalidad,
      'PENDIENTE',
      'PENDIENTE',
      orderItems,
      total,
      new Date(),
      new Date()
    )

    await this.orderRepository.save(order)

    // Notificación en Tiempo Real
    try {
      const io = getSocket()
      io.emit('nuevo_pedido', {
        id: order.id,
        mesaId: order.mesaId,
        total: order.total,
        items: orderItems.length
      })
    } catch (e) {
      console.warn('Socket no inicializado, el pedido se guardó pero no se notificó en real-time')
    }

    return order
  }
}
