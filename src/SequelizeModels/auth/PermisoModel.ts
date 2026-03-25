import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../shared/infrastructure/database/sequelize.client'

export class PermisoModel extends Model {
  public id!: string
  public nombre!: string
  public descripcion!: string | null
}

PermisoModel.init(
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
    tableName: 'permisos',
    schema: 'auth',
    timestamps: false,
  }
)
