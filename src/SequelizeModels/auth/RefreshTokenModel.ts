import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../shared/infrastructure/database/sequelize.client'

export class RefreshTokenModel extends Model {
  public id!: string
  public userId!: string
  public token!: string
  public expiresAt!: Date
  public createdAt!: Date
}

RefreshTokenModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    schema: 'auth',
    timestamps: false,
  }
)
