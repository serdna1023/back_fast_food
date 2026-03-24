import { Request, Response } from 'express'
import { CrearPedido, CrearPedidoDTO } from '../use-cases/CrearPedido'
import { CambiarEstadoPedido } from '../use-cases/CambiarEstadoPedido'
import { ObtenerCuentaMesa } from '../use-cases/ObtenerCuentaMesa'
import { ObtenerDetallePedido } from '../use-cases/ObtenerDetallePedido'
import { UnirMesas } from '../use-cases/UnirMesas'
import { LiberarMesa } from '../use-cases/LiberarMesa'
import { CambiarEstadoItem } from '../use-cases/CambiarEstadoItem'
import { IOrderRepository } from '../repositories/interfaces/IOrderRepository'
import { OrderStatus } from '../entities/Order'

export class OrderController {
  constructor(
    private readonly crearPedido: CrearPedido,
    private readonly cambiarEstadoPedido: CambiarEstadoPedido,
    private readonly obtenerCuentaMesa: ObtenerCuentaMesa,
    private readonly orderRepository: IOrderRepository,
    private readonly cambiarEstadoItemUC: CambiarEstadoItem,
    private readonly obtenerDetallePedido: ObtenerDetallePedido
  ) {}

  crear = async (req: Request, res: Response) => {
    try {
      const dto: CrearPedidoDTO = req.body
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
      const pedidos = await this.orderRepository.findByMesa(mesaId, true)
      
      const updatePromises = pedidos.map(p => {
        p.marcarComoPagado()
        return this.orderRepository.save(p)
      })

      await Promise.all(updatePromises)
      res.status(200).json({ message: `Mesa ${mesaId} pagada correctamente. Se liberó la cuenta.` })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  unirMesas = async (req: Request, res: Response) => {
    try {
      const { mesaId, parentMesaId } = req.body
      const unirMesasUC = new UnirMesas() // Podríamos inyectarlos, pero para simplificar aquí
      await unirMesasUC.execute(mesaId, parentMesaId)
      res.status(200).json({ message: `Mesa ${mesaId} unida a ${parentMesaId}` })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  liberarMesa = async (req: Request, res: Response) => {
    try {
      const mesaId = req.params.mesaId as string
      const liberarMesaUC = new LiberarMesa()
      await liberarMesaUC.execute(mesaId)
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
