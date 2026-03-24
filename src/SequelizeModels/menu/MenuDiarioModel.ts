import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/shared/infrastructure/database/sequelize.client'
import { MenuPlatoModel } from './MenuPlatoModel'

export class MenuDiarioModel extends Model {
  public id!: string
  public precio!: number
  public fecha!: Date
  public creadoPor!: string
  public createdAt!: Date
  public updatedAt!: Date

  // Asociaciones
  public readonly platos?: MenuPlatoModel[]
}

MenuDiarioModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('precio')
        return rawValue === null ? null : parseFloat(rawValue)
      },
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    creadoPor: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'creado_por',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'diarios',
    schema: 'menu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)
