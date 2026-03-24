import { Request, Response } from 'express'
import { CrearPlato } from '@/menu/use-cases/plato/CrearPlato'
import { ListarPlatos } from '@/menu/use-cases/plato/ListarPlatos'
import { ObtenerPlatoPorId } from '@/menu/use-cases/plato/ObtenerPlatoPorId'
import { ListarPlatosPorCategoria } from '@/menu/use-cases/plato/ListarPlatosPorCategoria'
import { ActualizarPlato } from '@/menu/use-cases/plato/ActualizarPlato'
import { EliminarPlato } from '@/menu/use-cases/plato/EliminarPlato'
import { BuscarPlatosPorNombre } from '@/menu/use-cases/plato/BuscarPlatosPorNombre'

/**
 * PlatoController maneja todas las solicitudes HTTP relacionadas con los Platos.
 */
export class PlatoController {
  constructor(
    private readonly crearPlatoUseCase: CrearPlato,
    private readonly listarPlatosUseCase: ListarPlatos,
    private readonly obtenerPlatoPorIdUseCase: ObtenerPlatoPorId,
    private readonly listarPlatosPorCategoriaUseCase: ListarPlatosPorCategoria,
    private readonly actualizarPlatoUseCase: ActualizarPlato,
    private readonly eliminarPlatoUseCase: EliminarPlato,
    private readonly buscarPlatosPorNombreUseCase: BuscarPlatosPorNombre
  ) {}

  /**
   * POST /platos
   * Crea un nuevo plato (CARTA o MENU).
   */
  crearPlato = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId, name, description, tipo, price, imageUrl, available } = req.body

      // Validación básica
      if (!categoryId || !name || !tipo) {
        res.status(400).json({ error: 'Faltan campos obligatorios: categoryId, name, tipo' })
        return
      }

      const plato = await this.crearPlatoUseCase.execute({
        categoryId,
        name,
        description,
        tipo,
        price,
        imageUrl,
        available
      })

      res.status(201).json(plato)
    } catch (error: any) {
      if (error.message.includes('no existe') || error.message.includes('negativo') || error.message.includes('precio')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Error del servidor al crear el plato' })
      }
    }
  }

  /**
   * GET /platos
   */
  listarPlatos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const platos = await this.listarPlatosUseCase.execute()
      res.status(200).json(platos)
    } catch (error: any) {
      res.status(500).json({ error: 'Error interno al obtener platos' })
    }
  }

  /**
   * GET /platos/:id
   */
  obtenerPlatoPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const plato = await this.obtenerPlatoPorIdUseCase.execute(id)
      res.status(200).json(plato)
    } catch (error: any) {
      if (error.message.includes('no encontrado')) {
        res.status(404).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Error al obtener el plato' })
      }
    }
  }

  /**
   * GET /platos/category/:categoryId
   */
  listarPlatosPorCategoriaEndpoint = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = req.params as { categoryId: string }
      const platos = await this.listarPlatosPorCategoriaUseCase.execute(categoryId)
      res.status(200).json(platos)
    } catch (error: any) {
      if (error.message.includes('no encontrada')) {
        res.status(404).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Error al obtener platos por categoría' })
      }
    }
  }

  /**
   * PATCH /platos/:id
   */
  actualizarPlato = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const { categoryId, name, description, tipo, price, imageUrl, available } = req.body

      const platoActualizado = await this.actualizarPlatoUseCase.execute({
        id,
        categoryId,
        name,
        description,
        tipo,
        price,
        imageUrl,
        available
      })

      res.status(200).json(platoActualizado)
    } catch (error: any) {
      if (error.message.includes('no encontrado') || error.message.includes('no existe')) {
        res.status(404).json({ error: error.message })
      } else if (error.message.includes('negativo') || error.message.includes('precio')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Error al actualizar el plato' })
      }
    }
  }

  /**
   * DELETE /platos/:id
   */
  eliminarPlato = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      await this.eliminarPlatoUseCase.execute(id)
      res.status(204).send()
    } catch (error: any) {
       if (error.message.includes('no encontrado')) {
        res.status(404).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Error interno al eliminar el plato' })
      }
    }
  }

  /**
   * GET /platos/search?search=texto
   */
  buscarPlatos = async (req: Request, res: Response): Promise<void> => {
    try {
      const { search } = req.query

      if (!search || typeof search !== 'string') {
        res.status(400).json({ error: 'El parámetro "search" es requerido y debe ser texto' })
        return
      }

      const platos = await this.buscarPlatosPorNombreUseCase.execute(search)
      res.status(200).json(platos)
    } catch (error: any) {
      res.status(500).json({ error: 'Error al buscar platos' })
    }
  }
}
