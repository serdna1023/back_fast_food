export interface ApproveCheckInRequest {
  restaurantId: string;
  mesaId: string;
  staffUserId: string; // Para saber quién aprobó (opcional para el log)
}

export interface ApproveCheckInResponse {
  guestToken: string;
  orderId: string;
}
