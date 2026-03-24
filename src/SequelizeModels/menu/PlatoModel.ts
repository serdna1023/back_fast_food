import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/shared/infrastructure/database/sequelize.client'
import { CategoryModel } from './CategoryModel'

export class PlatoModel extends Model {
  public id!: string
  public categoryId!: string
  public name!: string
  public description!: string | null
  public tipo!: 'CARTA' | 'MENU'
  public price!: number | null
  public imageUrl!: string | null
  public available!: boolean
  public createdAt!: Date
  public updatedAt!: Date
}

PlatoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id',
      references: {
        model: CategoryModel,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM('CARTA', 'MENU'),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('price')
        return rawValue === null ? null : parseFloat(rawValue)
      },
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'image_url',
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'platos',
    schema: 'menu',
    timestamps: true, // Sequelize maneja createdAt y updatedAt automáticamente
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)
