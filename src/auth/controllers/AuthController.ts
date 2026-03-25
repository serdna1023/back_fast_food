import { Request, Response } from 'express';
import { Login } from '../use-cases/Login';
import { Logout } from '../use-cases/Logout';

export class AuthController {
  constructor(
    private readonly loginUseCase: Login,
    private readonly logoutUseCase: Logout
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute({ email, password });

      // Enviamos el token en una Cookie HttpOnly para máxima seguridad (Anti-XSS)
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000 // 8 horas
      });

      res.status(200).json({
        message: 'Login exitoso',
        user: result.user
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Error en la autenticación' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const token = req.cookies['auth_token'];
    
    await this.logoutUseCase.execute({ token });

    res.clearCookie('auth_token');
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  }
}
