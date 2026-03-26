export interface RegisterRequest {
  restaurantId: string;
  username: string;
  email: string;
  password: string;
  roles?: string[];
}
