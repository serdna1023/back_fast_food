import { OrderModalidad } from '../entities/Order'

export interface ItemPedidoInput {
  platoId?: string;
  diarioId?: string;
  cantidad: number;
  notas?: string;
}

export interface CrearPedidoDTO {
  restaurantId: string;
  userId?: string;
  customerName?: string;
  mesaId?: string;
  orderId?: string; // Si viene del GuestToken, usamos la orden existente
  modalidad: OrderModalidad;
  items: ItemPedidoInput[];
}
