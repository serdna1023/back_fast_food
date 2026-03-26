import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IPasswordHasher } from '../security/IPasswordHasher';
import { ITokenService } from '../security/ITokenService';
import { IRefreshTokenRepository } from '../repositories/interfaces/IRefreshTokenRepository';
import { User } from '../entities/User';
import { LoginRequest, LoginResponse } from '../dtos/LoginDTO';

export class Login {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
    private readonly refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request;

    // 1. Buscar usuario
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // 2. Verificar estado
    if (!user.active) {
      throw new Error('Tu cuenta está desactivada');
    }

    // 3. Comparar contraseñas
    const isPasswordValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // 4. Generar Token (Incluyendo restaurantId y Roles para el SaaS)
    const token = this.tokenService.generateToken(
      {
        sub: user.id,
        restaurantId: user.restaurantId,
        roles: user.roles,
        permissions: user.permissions
      },
      '8h' // Expira en 8 horas
    );

    // 5. Persistir sesión (Refresh Token)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);
    await this.refreshTokenRepository.save(user.id, token, expiresAt);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        restaurantId: user.restaurantId,
        roles: user.roles,
        permissions: user.permissions
      }
    };
  }
}
