import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@/shared/infrastructure/database/sequelize.client'

export class OrderModel extends Model {
  public id!: string
  public restaurantId!: string
  public userId!: string | null
  public customerName!: string | null
  public mesaId!: string | null
  public modalidad!: 'MESA' | 'LLEVAR'
  public estado!: 'PENDIENTE' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO' | 'CANCELADO'
  public pagoEstado!: 'PENDIENTE' | 'PAGADO'
  public total!: number
  public readonly items?: any[] // Usamos any[] o el tipo del modelo para evitar el error de tipado
  public createdAt!: Date
  public updatedAt!: Date
}

OrderModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'restaurant_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
    },
    customerName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'customer_name',
    },
    mesaId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'mesa_id',
    },
    modalidad: {
      type: DataTypes.ENUM('MESA', 'LLEVAR'),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'PREPARANDO', 'LISTO', 'ENTREGADO', 'CANCELADO'),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
    pagoEstado: {
      type: DataTypes.ENUM('PENDIENTE', 'PAGADO'),
      allowNull: false,
      field: 'pago_estado',
      defaultValue: 'PENDIENTE',
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      get() {
        return parseFloat(this.getDataValue('total'))
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'orders',
    schema: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)
