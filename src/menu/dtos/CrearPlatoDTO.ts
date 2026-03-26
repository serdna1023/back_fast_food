export interface CrearPlatoDTO {
  restaurantId: string; // añadimos restaurantId para multitenant
  categoryId: string;
  name: string;
  description?: string | null;
  tipo: 'CARTA' | 'MENU';
  price?: number | null;
  imageUrl?: string | null;
  available?: boolean;
}
