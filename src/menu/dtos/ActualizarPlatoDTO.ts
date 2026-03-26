export interface ActualizarPlatoDTO {
  id: string; // Para identificar el plato
  restaurantId: string; // Para asegurar la pertenencia (multitenancy)
  categoryId?: string;
  name?: string;
  description?: string | null;
  tipo?: 'CARTA' | 'MENU';
  price?: number | null;
  imageUrl?: string | null;
  available?: boolean;
}
