import { Request, Response } from 'express'
import { CrearCategoria } from '@/menu/use-cases/category/CrearCategoria'
import { ListarCategorias } from '@/menu/use-cases/category/ListarCategorias'
import { ObtenerCategoriaPorId } from '@/menu/use-cases/category/ObtenerCategoriaPorId'
import { ActualizarCategoria } from '@/menu/use-cases/category/ActualizarCategoria'
import { EliminarCategoria } from '@/menu/use-cases/category/EliminarCategoria'

/**
 * CategoryController maneja todas las solicitudes HTTP relacionadas con las categorías del menú.
 * Actúa como adaptador de entrada (Input Adapter) en nuestra arquitectura.
 * Extrae los parámetros de la request (req) e invoca los Casos de Uso correspondientes.
 */
export class CategoryController {
  constructor(
    private readonly crearCategoria: CrearCategoria,
    private readonly listarCategorias: ListarCategorias,
    private readonly obtenerCategoriaPorId: ObtenerCategoriaPorId,
    private readonly actualizarCategoria: ActualizarCategoria,
    private readonly eliminarCategoria: EliminarCategoria
  ) {}

  /**
   * Maneja POST /categories
   * Crea una nueva categoría.
   */
  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body
      if (!name) {
        res.status(400).json({ error: 'El nombre es obligatorio' })
        return
      }

      const category = await this.crearCategoria.execute(name)
      res.status(201).json(category)
    } catch (error: any) {
      if (error.message.includes('ya existe') || error.message.includes('caracteres')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Error interno del servidor al crear categoría' })
      }
    }
  }

  /**
   * Maneja GET /categories
   * Obtiene la lista completa de todas las categorías.
   */
  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.listarCategorias.execute()
      res.status(200).json(categories)
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener las categorías' })
    }
  }

  /**
   * Maneja GET /categories/:id
   * Obtiene los detalles de una categoría específica.
   */
  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const category = await this.obtenerCategoriaPorId.execute(id)
      res.status(200).json(category)
    } catch (error: any) {
      if (error.message.includes('no encontrada')) {
        res.status(404).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Error al obtener categoría' })
      }
    }
  }

  /**
   * Maneja PUT o PATCH /categories/:id
   * Actualiza el nombre de una categoría existente.
   */
  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const { name } = req.body

      if (!name) {
         res.status(400).json({ error: 'El nombre es obligatorio para actualizar' })
         return
      }

      const updatedCategory = await this.actualizarCategoria.execute(id, name)
      res.status(200).json(updatedCategory)
    } catch (error: any) {
      if (error.message.includes('no encontrada')) {
        res.status(404).json({ error: error.message })
      } else if (error.message.includes('en uso') || error.message.includes('caracteres')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Error interno del servidor al actualizar categoría' })
      }
    }
  }

  /**
   * Maneja DELETE /categories/:id
   * Elimina una categoría si no tiene ítems asociados.
   */
  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      await this.eliminarCategoria.execute(id)
      res.status(204).send() // Not Content (Exitoso)
    } catch (error: any) {
      if (error.message.includes('no encontrada')) {
        res.status(404).json({ error: error.message })
      } else if (error.message.includes('ítems asociados')) {
        // Conflicto de relación de datos: código HTTP 409
        res.status(409).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Error interno del servidor al eliminar la categoría' })
      }
    }
  }
}
