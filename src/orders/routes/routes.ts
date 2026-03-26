import { Router } from 'express'
import { OrderController } from '../controllers/OrderController'
import { CrearPedido } from '../use-cases/CrearPedido'
import { CambiarEstadoPedido } from '../use-cases/CambiarEstadoPedido'
import { ObtenerCuentaMesa } from '../use-cases/ObtenerCuentaMesa'
import { ObtenerDetallePedido } from '../use-cases/ObtenerDetallePedido'
import { CambiarEstadoItem } from '../use-cases/CambiarEstadoItem'
import { UnirMesas } from '../use-cases/UnirMesas'
import { LiberarMesa } from '../use-cases/LiberarMesa'
import { SequelizeOrderRepository } from '../repositories/implementations/SequelizeOrderRepository'
import { SequelizeMesaRepository } from '../repositories/implementations/SequelizeMesaRepository'
import { SequelizePlatoRepository } from '@/menu/repositories/implementations/SequelizePlatoRepository'
import { SequelizeMenuDiarioRepository } from '@/menu/repositories/implementations/SequelizeMenuDiarioRepository'

const router = Router()

// Inyección de Dependencias
const orderRepository = new SequelizeOrderRepository()
const mesaRepository = new SequelizeMesaRepository()
const platoRepository = new SequelizePlatoRepository()
const menuDiarioRepository = new SequelizeMenuDiarioRepository()

const crearPedido = new CrearPedido(orderRepository, platoRepository, menuDiarioRepository)
const cambiarEstadoPedido = new CambiarEstadoPedido(orderRepository)
const obtenerCuentaMesa = new ObtenerCuentaMesa(orderRepository)
const cambiarEstadoItem = new CambiarEstadoItem(orderRepository)
const obtenerDetallePedido = new ObtenerDetallePedido(orderRepository)
const unirMesasUC = new UnirMesas(mesaRepository)
const liberarMesaUC = new LiberarMesa(mesaRepository)

const controller = new OrderController(
  crearPedido,
  cambiarEstadoPedido,
  obtenerCuentaMesa,
  orderRepository,
  mesaRepository,
  cambiarEstadoItem,
  obtenerDetallePedido,
  unirMesasUC,
  liberarMesaUC
)

// Rutas
router.post('/', controller.crear)
router.get('/:id', controller.obtenerPorId) // Endpoint para consulta detallada del cliente
router.get('/activos', controller.listarActivos)
router.patch('/:id/estado', controller.cambiarEstado)
router.get('/mesa/:mesaId/cuenta', controller.verCuentaMesa)
router.post('/mesa/:mesaId/pagar', controller.pagarCuentaMesa)

// Administración de Mesas (Uniones)
router.post('/mesas/unir', controller.unirMesas)
router.delete('/mesas/:mesaId/liberar', controller.liberarMesa)

// Gestión de Ítems Individuales
router.patch('/item/:id/estado', controller.cambiarEstadoItem)

export { router as OrderRouter }
