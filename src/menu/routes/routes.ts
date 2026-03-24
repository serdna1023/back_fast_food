import { Router } from 'express'
import { CategoryController } from '../controllers/CategoryController'
import { PlatoController } from '../controllers/PlatoController'
import { MenuDiarioController } from '../controllers/MenuDiarioController'

// Use Cases: Categorías
import { CrearCategoria } from '../use-cases/category/CrearCategoria'
import { ListarCategorias } from '../use-cases/category/ListarCategorias'
import { ObtenerCategoriaPorId } from '../use-cases/category/ObtenerCategoriaPorId'
import { ActualizarCategoria } from '../use-cases/category/ActualizarCategoria'
import { EliminarCategoria } from '../use-cases/category/EliminarCategoria'

// Use Cases: Platos
import { CrearPlato } from '../use-cases/plato/CrearPlato'
import { ListarPlatos } from '../use-cases/plato/ListarPlatos'
import { ObtenerPlatoPorId } from '../use-cases/plato/ObtenerPlatoPorId'
import { ListarPlatosPorCategoria } from '../use-cases/plato/ListarPlatosPorCategoria'
import { ActualizarPlato } from '../use-cases/plato/ActualizarPlato'
import { EliminarPlato } from '../use-cases/plato/EliminarPlato'
import { BuscarPlatosPorNombre } from '../use-cases/plato/BuscarPlatosPorNombre'

// Use Cases: Menú Diario
import { CrearMenuDiario } from '../use-cases/menu-diario/CrearMenuDiario'
import { ListarMenusDiarios } from '../use-cases/menu-diario/ListarMenusDiarios'
import { ObtenerMenuDiarioHoy } from '../use-cases/menu-diario/ObtenerMenuDiarioHoy'
import { CambiarDisponibilidadPlatoMenu } from '../use-cases/menu-diario/CambiarDisponibilidadPlatoMenu'

// Repositorios
import { SequelizeCategoryRepository } from '../repositories/implementations/SequelizeCategoryRepository'
import { SequelizePlatoRepository } from '../repositories/implementations/SequelizePlatoRepository'
import { SequelizeMenuDiarioRepository } from '../repositories/implementations/SequelizeMenuDiarioRepository'

const router = Router()

/**
 * ==========================================
 * 1. INYECCIÓN DE DEPENDENCIAS A REPOSITORIOS
 * ==========================================
 */
const categoryRepository = new SequelizeCategoryRepository()
const platoRepository = new SequelizePlatoRepository()
const menuDiarioRepository = new SequelizeMenuDiarioRepository()

/**
 * ==========================================
 * 2. INSTANCIAR CASOS DE USO (USE CASES)
 * ==========================================
 */
// --- Categories Use Cases
const crearCategoria = new CrearCategoria(categoryRepository)
const listarCategorias = new ListarCategorias(categoryRepository)
const obtenerCategoriaPorId = new ObtenerCategoriaPorId(categoryRepository)
const actualizarCategoria = new ActualizarCategoria(categoryRepository)
const eliminarCategoria = new EliminarCategoria(categoryRepository, platoRepository)

// --- Plato Use Cases
const crearPlato = new CrearPlato(platoRepository, categoryRepository)
const listarPlatos = new ListarPlatos(platoRepository)
const obtenerPlatoPorId = new ObtenerPlatoPorId(platoRepository)
const listarPlatosPorCategoria = new ListarPlatosPorCategoria(platoRepository, categoryRepository)
const actualizarPlato = new ActualizarPlato(platoRepository, categoryRepository)
const eliminarPlato = new EliminarPlato(platoRepository)
const buscarPlatosPorNombre = new BuscarPlatosPorNombre(platoRepository)

// --- Menu Diario Use Cases
const crearMenuDiario = new CrearMenuDiario(menuDiarioRepository, platoRepository)
const listarMenusDiarios = new ListarMenusDiarios(menuDiarioRepository)
const obtenerMenuDiarioHoy = new ObtenerMenuDiarioHoy(menuDiarioRepository)
const cambiarDisponibilidadPlatoMenu = new CambiarDisponibilidadPlatoMenu(menuDiarioRepository)

/**
 * ==========================================
 * 3. INSTANCIAR CONTROLADORES
 * ==========================================
 */
const categoryController = new CategoryController(
  crearCategoria,
  listarCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria
)

const platoController = new PlatoController(
  crearPlato,
  listarPlatos,
  obtenerPlatoPorId,
  listarPlatosPorCategoria,
  actualizarPlato,
  eliminarPlato,
  buscarPlatosPorNombre
)

const menuDiarioController = new MenuDiarioController(
  crearMenuDiario,
  listarMenusDiarios,
  obtenerMenuDiarioHoy,
  cambiarDisponibilidadPlatoMenu
)

/**
 * ==========================================
 * 4. DEFINICIÓN DE RUTAS (ENDPOINTS)
 * ==========================================
 */

// RUTAS: Categorías
router.get('/categories', categoryController.getCategories)
router.get('/categories/:id', categoryController.getCategoryById)
router.post('/categories', categoryController.createCategory)
router.patch('/categories/:id', categoryController.updateCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

// RUTAS: Platos
router.get('/platos/search', platoController.buscarPlatos)
router.get('/platos', platoController.listarPlatos)
router.get('/platos/:id', platoController.obtenerPlatoPorId)
router.get('/platos/category/:categoryId', platoController.listarPlatosPorCategoriaEndpoint)
router.post('/platos', platoController.crearPlato)
router.patch('/platos/:id', platoController.actualizarPlato)
router.delete('/platos/:id', platoController.eliminarPlato)

// RUTAS: Menú Diario
router.get('/menu-diario/hoy', menuDiarioController.obtenerHoy)
router.get('/menu-diario', menuDiarioController.listar)
router.post('/menu-diario', menuDiarioController.crear)
router.patch('/menu-diario/:menuId/plato/:detalleId', menuDiarioController.cambiarDisponibilidad)

export { router as MenuRouter }
