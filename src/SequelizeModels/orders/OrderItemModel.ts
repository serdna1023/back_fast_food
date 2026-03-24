import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/shared/infrastructure/database/sequelize.client'
import { OrderModel } from './OrderModel'
import { PlatoModel } from '../menu/PlatoModel'
import { MenuDiarioModel } from '../menu/MenuDiarioModel'

export class OrderItemModel extends Model {
  public id!: string
  public orderId!: string
  public platoId!: string | null
  public diarioId!: string | null
  public cantidad!: number
  public precioUnitario!: number
  public notas!: string | null
  public estado!: 'PENDIENTE' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO'
  public createdAt!: Date
  public updatedAt!: Date
}

OrderItemModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id',
      references: {
        model: OrderModel,
        key: 'id',
      },
    },
    platoId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'plato_id',
      references: {
        model: PlatoModel,
        key: 'id',
      },
    },
    diarioId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'diario_id',
      references: {
        model: MenuDiarioModel,
        key: 'id',
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'precio_unitario',
      get() {
        return parseFloat(this.getDataValue('precioUnitario'))
      },
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'PREPARANDO', 'LISTO', 'ENTREGADO', 'CANCELADO'),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'order_items',
    schema: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)
