import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../shared/infrastructure/database/sequelize.client'

export class RestauranteModel extends Model {
  public id!: string
  public nombre!: string
  public slug!: string
  public latitud!: number | null
  public longitud!: number | null
  public direccion!: string | null
  public configuracion!: any
  public activo!: boolean
}

RestauranteModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitud: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    configuracion: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'RestauranteModel',
    tableName: 'restaurantes',
    schema: 'core',
    timestamps: true,
    underscored: true,
  }
)
