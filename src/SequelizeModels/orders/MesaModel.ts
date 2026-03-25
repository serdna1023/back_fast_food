import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/shared/infrastructure/database/sequelize.client'

export class MesaModel extends Model {
  public id!: string
  public restaurantId!: string
  public parentMesaId!: string | null
  public isActive!: boolean
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
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'mesas',
    schema: 'orders',
    timestamps: false,
  }
)
