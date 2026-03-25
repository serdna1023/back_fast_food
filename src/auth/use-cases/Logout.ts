import { IRefreshTokenRepository } from '../repositories/RefreshTokenRepository';

export interface LogoutRequest {
  token?: string;
}

export class Logout {
  constructor(private readonly refreshTokenRepository: IRefreshTokenRepository) {}

  async execute(request: LogoutRequest): Promise<void> {
    if (request.token) {
      // Invalida el token específico en la base de datos
      await this.refreshTokenRepository.deleteByToken(request.token);
    }
  }
}
