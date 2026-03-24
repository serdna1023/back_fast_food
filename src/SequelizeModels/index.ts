import { sequelize } from '@/shared/infrastructure/database/sequelize.client'
import { CategoryModel } from './menu/CategoryModel'
import { PlatoModel } from './menu/PlatoModel'
import { MenuDiarioModel } from './menu/MenuDiarioModel'
import { MenuPlatoModel } from './menu/MenuPlatoModel'
import { OrderModel } from './orders/OrderModel'
import { OrderItemModel } from './orders/OrderItemModel'
import { UsuarioModel } from './auth/UsuarioModel'
import { MesaModel } from './orders/MesaModel'

// --- Relaciones Categorías y Platos
CategoryModel.hasMany(PlatoModel, { foreignKey: 'categoryId', as: 'platos' })
PlatoModel.belongsTo(CategoryModel, { foreignKey: 'categoryId', as: 'category' })

// --- Relaciones para Menú Diario
MenuDiarioModel.hasMany(MenuPlatoModel, { foreignKey: 'menuDiarioId', as: 'platos' })
MenuPlatoModel.belongsTo(MenuDiarioModel, { foreignKey: 'menuDiarioId', as: 'menuDiario' })
MenuPlatoModel.belongsTo(PlatoModel, { foreignKey: 'platoId', as: 'plato' })
MenuDiarioModel.belongsTo(UsuarioModel, { foreignKey: 'creadoPor', as: 'autor' })

// --- Relaciones para Pedidos (Orders)
OrderModel.hasMany(OrderItemModel, { foreignKey: 'orderId', as: 'items' })
OrderItemModel.belongsTo(OrderModel, { foreignKey: 'orderId', as: 'order' })

OrderItemModel.belongsTo(PlatoModel, { foreignKey: 'platoId', as: 'plato' })
OrderItemModel.belongsTo(MenuDiarioModel, { foreignKey: 'diarioId', as: 'menuDiario' })

OrderModel.belongsTo(UsuarioModel, { foreignKey: 'userId', as: 'usuario' })

// --- Relaciones para Mesas (Uniones)
MesaModel.hasMany(MesaModel, { foreignKey: 'parentMesaId', as: 'hijas' })
MesaModel.belongsTo(MesaModel, { foreignKey: 'parentMesaId', as: 'maestra' })

export {
  sequelize,
  CategoryModel,
  PlatoModel,
  MenuDiarioModel,
  MenuPlatoModel,
  OrderModel,
  OrderItemModel,
  UsuarioModel,
  MesaModel
}
