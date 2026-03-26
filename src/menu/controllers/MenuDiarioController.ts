import { Request, Response } from 'express'
import { CrearMenuDiario } from '@/menu/use-cases/menu-diario/CrearMenuDiario'
import { ListarMenusDiarios } from '@/menu/use-cases/menu-diario/ListarMenusDiarios'
import { ObtenerMenuDiarioHoy } from '@/menu/use-cases/menu-diario/ObtenerMenuDiarioHoy'
import { CambiarDisponibilidadPlatoMenu } from '@/menu/use-cases/menu-diario/CambiarDisponibilidadPlatoMenu'
import { CrearMenuDiarioDTO } from '../dtos/CrearMenuDiarioDTO'

export class MenuDiarioController {
  constructor(
    private readonly crearMenuDiario: CrearMenuDiario,
    private readonly listarMenusDiarios: ListarMenusDiarios,
    private readonly obtenerMenuDiarioHoy: ObtenerMenuDiarioHoy,
    private readonly cambiarDisponibilidadPlatoMenu: CambiarDisponibilidadPlatoMenu
  ) {}

  cambiarDisponibilidad = async (req: Request, res: Response) => {
    try {
      const menuId = req.params.menuId as string
      const detalleId = req.params.detalleId as string
      const { disponible } = req.body
      await this.cambiarDisponibilidadPlatoMenu.execute(menuId, detalleId, disponible)
      res.status(200).json({ message: 'Estado del plato actualizado correctamente' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  crear = async (req: Request, res: Response) => {
    try {
      const { restaurantId, precio, fecha, creadoPor, platos } = req.body
      const menu = await this.crearMenuDiario.execute({
        restaurantId,
        precio,
        fecha: fecha ? new Date(fecha) : undefined,
        creadoPor,
        platos
      })
      res.status(201).json(menu)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  listar = async (_req: Request, res: Response) => {
    try {
      const menus = await this.listarMenusDiarios.execute()
      res.status(200).json(menus)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  obtenerHoy = async (_req: Request, res: Response) => {
    try {
      const menu = await this.obtenerMenuDiarioHoy.execute()
      if (!menu) return res.status(404).json({ message: 'No hay menú programado para hoy' })
      res.status(200).json(menu)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
