import { Request, Response } from 'express'
import { CrearPedido } from '../use-cases/CrearPedido'
import { CrearPedidoDTO } from '../dtos/CrearPedidoDTO'
import { CambiarEstadoPedido } from '../use-cases/CambiarEstadoPedido'
import { ObtenerCuentaMesa } from '../use-cases/ObtenerCuentaMesa'
import { ObtenerDetallePedido } from '../use-cases/ObtenerDetallePedido'
import { UnirMesas } from '../use-cases/UnirMesas'
import { LiberarMesa } from '../use-cases/LiberarMesa'
import { CambiarEstadoItem } from '../use-cases/CambiarEstadoItem'
import { IOrderRepository } from '../repositories/interfaces/IOrderRepository'
import { IMesaRepository } from '../repositories/interfaces/IMesaRepository'
import { OrderStatus } from '../entities/Order'

export class OrderController {
  constructor(
    private readonly crearPedido: CrearPedido,
    private readonly cambiarEstadoPedido: CambiarEstadoPedido,
    private readonly obtenerCuentaMesa: ObtenerCuentaMesa,
    private readonly orderRepository: IOrderRepository,
    private readonly mesaRepository: IMesaRepository,
    private readonly cambiarEstadoItemUC: CambiarEstadoItem,
    private readonly obtenerDetallePedido: ObtenerDetallePedido,
    private readonly unirMesasUC: UnirMesas,
    private readonly liberarMesaUC: LiberarMesa
  ) {}

  crear = async (req: Request, res: Response) => {
    try {
      const dto: CrearPedidoDTO = req.body

      // Si el usuario tiene un GuestToken, usar su orderId y restaurantId
      const user = (req as any).user
      if (user) {
        if (!dto.restaurantId) dto.restaurantId = user.restaurantId
        if (user.orderId) dto.orderId = user.orderId
      }

      const order = await this.crearPedido.execute(dto)
      res.status(201).json(order)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  cambiarEstado = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string
      const { estado } = req.body
      await this.cambiarEstadoPedido.execute(id, estado as OrderStatus)
      res.status(200).json({ message: 'Estado del pedido actualizado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  verCuentaMesa = async (req: Request, res: Response) => {
    try {
      const mesaId = req.params.mesaId as string
      const cuenta = await this.obtenerCuentaMesa.execute(mesaId)
      res.status(200).json(cuenta)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  listarActivos = async (_req: Request, res: Response) => {
    try {
      const pedidos = await this.orderRepository.listActivos()
      res.status(200).json(pedidos)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  pagarCuentaMesa = async (req: Request, res: Response) => {
    try {
      const mesaId = req.params.mesaId as string
      const { restaurantId } = req.body
      const pedidos = await this.orderRepository.findByMesa(mesaId, true)
      
      if (pedidos.length === 0) {
        res.status(404).json({ error: 'No hay cuentas pendientes en esta mesa' })
        return
      }

      // 1. Marcar todos los pedidos como PAGADOS
      const updatePromises = pedidos.map(p => {
        p.marcarComoPagado()
        return this.orderRepository.save(p)
      })
      await Promise.all(updatePromises)

      // 2. Cerrar la Mesa usando el repositorio de dominio
      const mesa = await this.mesaRepository.findById(mesaId, restaurantId)
      if (mesa) {
        mesa.liberar()
        await this.mesaRepository.save(mesa)
      }

      res.status(200).json({ 
        message: `Mesa ${mesaId} pagada y cerrada correctamente.`,
        pedidosPagados: pedidos.length
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  unirMesas = async (req: Request, res: Response) => {
    try {
      const { mesaId, parentMesaId, restaurantId } = req.body
      await this.unirMesasUC.execute(mesaId, restaurantId, parentMesaId)
      res.status(200).json({ message: `Mesa ${mesaId} unida a ${parentMesaId}` })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  liberarMesa = async (req: Request, res: Response) => {
    try {
      const mesaId = req.params.mesaId as string
      const { restaurantId } = req.body
      await this.liberarMesaUC.execute(mesaId, restaurantId)
      res.status(200).json({ message: `Mesa ${mesaId} liberada / independiente` })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  cambiarEstadoItem = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string
      const { estado } = req.body
      await this.cambiarEstadoItemUC.execute(id, estado as OrderStatus)
      res.status(200).json({ message: 'Estado del plato actualizado' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  obtenerPorId = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string
      const order = await this.obtenerDetallePedido.execute(id)
      res.status(200).json(order)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  }
}
