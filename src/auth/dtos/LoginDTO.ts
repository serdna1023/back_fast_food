import { User } from '../entities/User';

export interface LoginRequest {
  email: string;
  password: string;
  token?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    restaurantId: string;
    roles: string[];
    permissions: string[];
  };
}
