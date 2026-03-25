import { sequelize } from '@/shared/infrastructure/database/sequelize.client'
import { CategoryModel } from './menu/CategoryModel'
import { PlatoModel } from './menu/PlatoModel'
import { MenuDiarioModel } from './menu/MenuDiarioModel'
import { MenuPlatoModel } from './menu/MenuPlatoModel'
import { OrderModel } from './orders/OrderModel'
import { OrderItemModel } from './orders/OrderItemModel'
import { UsuarioModel } from './auth/UsuarioModel'
import { MesaModel } from './orders/MesaModel'
import { RestauranteModel } from './core/RestauranteModel'
import { RolModel } from './auth/RolModel'
import { PermisoModel } from './auth/PermisoModel'
import { UsuarioRolModel } from './auth/UsuarioRolModel'
import { RolPermisoModel } from './auth/RolPermisoModel'
import { RefreshTokenModel } from './auth/RefreshTokenModel'

// --- Relaciones Multitenant (Core)
CategoryModel.belongsTo(RestauranteModel, { foreignKey: 'restaurantId', as: 'restaurante' })
PlatoModel.belongsTo(RestauranteModel, { foreignKey: 'restaurantId', as: 'restaurante' })
MenuDiarioModel.belongsTo(RestauranteModel, { foreignKey: 'restaurantId', as: 'restaurante' })
MesaModel.belongsTo(RestauranteModel, { foreignKey: 'restaurantId', as: 'restaurante' })
OrderModel.belongsTo(RestauranteModel, { foreignKey: 'restaurantId', as: 'restaurante' })
UsuarioModel.belongsTo(RestauranteModel, { foreignKey: 'restaurantId', as: 'restaurante' })

// --- Relaciones RBAC (Gradia Style)
UsuarioModel.belongsToMany(RolModel, { through: UsuarioRolModel, foreignKey: 'userId', as: 'roles' })
RolModel.belongsToMany(UsuarioModel, { through: UsuarioRolModel, foreignKey: 'rolId', as: 'usuarios' })

RolModel.belongsToMany(PermisoModel, { through: RolPermisoModel, foreignKey: 'rolId', as: 'permisos' })
PermisoModel.belongsToMany(RolModel, { through: RolPermisoModel, foreignKey: 'permisoId', as: 'roles' })

UsuarioModel.hasMany(RefreshTokenModel, { foreignKey: 'userId', as: 'refreshTokens' })
RefreshTokenModel.belongsTo(UsuarioModel, { foreignKey: 'userId', as: 'usuario' })

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
  MesaModel,
  RestauranteModel,
  RolModel,
  PermisoModel,
  UsuarioRolModel,
  RolPermisoModel,
  RefreshTokenModel
}
