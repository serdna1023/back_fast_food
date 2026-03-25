import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../shared/infrastructure/database/sequelize.client'

export class RolPermisoModel extends Model {}

RolPermisoModel.init(
  {
    rolId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'rol_id',
      primaryKey: true,
    },
    permisoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'permiso_id',
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'rol_permisos',
    schema: 'auth',
    timestamps: false,
  }
)
