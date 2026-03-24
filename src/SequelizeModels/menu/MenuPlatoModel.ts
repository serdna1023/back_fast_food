import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/shared/infrastructure/database/sequelize.client'
import { MenuDiarioModel } from './MenuDiarioModel'
import { PlatoModel } from './PlatoModel'

export class MenuPlatoModel extends Model {
  public id!: string
  public menuDiarioId!: string
  public platoId!: string
  public tipoTiempo!: 'ENTRADA' | 'SEGUNDO'
  public disponible!: boolean

  // Asociaciones
  public readonly plato?: PlatoModel
}

MenuPlatoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    menuDiarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'diario_id',
      references: {
        model: MenuDiarioModel,
        key: 'id',
      },
    },
    platoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'plato_id',
      references: {
        model: PlatoModel,
        key: 'id',
      },
    },
    tipoTiempo: {
      type: DataTypes.ENUM('ENTRADA', 'SEGUNDO'),
      allowNull: false,
      field: 'tipo_tiempo',
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'diario_platos',
    schema: 'menu',
    timestamps: false,
  }
)
