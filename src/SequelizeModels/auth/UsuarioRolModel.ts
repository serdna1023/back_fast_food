import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../shared/infrastructure/database/sequelize.client'

export class UsuarioRolModel extends Model {}

UsuarioRolModel.init(
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      primaryKey: true,
    },
    rolId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'rol_id',
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'user_roles',
    schema: 'auth',
    timestamps: false,
  }
)
