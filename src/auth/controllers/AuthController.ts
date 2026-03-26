import { Request, Response } from 'express';
import { Login } from '../use-cases/Login';
import { Logout } from '../use-cases/Logout';
import { Register } from '../use-cases/Register';
import { RequestCheckIn } from '../use-cases/RequestCheckIn';
import { ApproveCheckIn } from '../use-cases/ApproveCheckIn';

export class AuthController {
  constructor(
    private readonly loginUseCase: Login,
    private readonly logoutUseCase: Logout,
    private readonly registerUseCase: Register,
    private readonly requestCheckInUseCase: RequestCheckIn,
    private readonly approveCheckInUseCase: ApproveCheckIn
  ) {}

  async requestCheckIn(req: Request, res: Response): Promise<void> {
    try {
      const { restaurantId, mesaId } = req.body;
      await this.requestCheckInUseCase.execute({ restaurantId, mesaId });
      res.status(200).json({ message: 'Solicitud de Check-In enviada. Por favor espere al mesero.' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async approveCheckIn(req: Request, res: Response): Promise<void> {
    try {
      const { restaurantId, mesaId } = req.body;
      const result = await this.approveCheckInUseCase.execute({ 
        restaurantId, 
        mesaId,
        staffUserId: (req as any).user?.id || 'SYSTEM'
      });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { restaurantId, username, email, password, roles } = req.body;
      const user = await this.registerUseCase.execute({
        restaurantId,
        username,
        email,
        password,
        roles
      });

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          restaurantId: user.restaurantId
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute({ email, password });

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
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies['auth_token'];
      if (token) {
        await this.logoutUseCase.execute(token);
      }

      res.clearCookie('auth_token');
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
