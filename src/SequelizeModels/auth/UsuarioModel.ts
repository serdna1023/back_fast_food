import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/shared/infrastructure/database/sequelize.client'

export class UsuarioModel extends Model {
  public id!: string
  public name!: string
  public email!: string
  public role!: 'ADMIN' | 'EMPLOYEE' | 'CLIENT'
  public createdAt!: Date
}

UsuarioModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'EMPLOYEE', 'CLIENT'),
      allowNull: false,
      defaultValue: 'CLIENT',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'users',
    schema: 'auth',
    timestamps: false,
  }
)
