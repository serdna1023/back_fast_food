import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/shared/infrastructure/database/sequelize.client'

export type MesaStatus = 'FREE' | 'WAITING' | 'OCCUPIED'

export class MesaModel extends Model {
  public id!: string
  public restaurantId!: string
  public parentMesaId!: string | null
  public status!: MesaStatus
  public isActive!: boolean
  public currentOrderId!: string | null
}

MesaModel.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    restaurantId: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: 'restaurant_id',
    },
    parentMesaId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'parent_mesa_id',
    },
    status: {
      type: DataTypes.ENUM('FREE', 'WAITING', 'OCCUPIED'),
      allowNull: false,
      defaultValue: 'FREE',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    currentOrderId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'current_order_id',
    },
  },
  {
    sequelize,
    tableName: 'mesas',
    schema: 'orders',
    timestamps: false,
  }
)
