import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../shared/infrastructure/database/sequelize.client'

export class RolModel extends Model {
  public id!: string
  public nombre!: string
  public descripcion!: string | null
}

RolModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    schema: 'auth',
    timestamps: false,
  }
)
