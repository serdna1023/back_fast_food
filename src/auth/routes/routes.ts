import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Login } from '../use-cases/Login';
import { Logout } from '../use-cases/Logout';
import { Register } from '../use-cases/Register';
import { RequestCheckIn } from '../use-cases/RequestCheckIn';
import { ApproveCheckIn } from '../use-cases/ApproveCheckIn';
import { SequelizeUserRepository } from '../repositories/implementations/SequelizeUserRepository';
import { SequelizeRefreshTokenRepository } from '../repositories/implementations/SequelizeRefreshTokenRepository';
import { SequelizeMesaRepository } from '@/orders/repositories/implementations/SequelizeMesaRepository';
import { SequelizeOrderRepository } from '@/orders/repositories/implementations/SequelizeOrderRepository';
import { BcryptHasher } from '../security/BcryptHasher';
import { JwtService } from '../security/JwtService';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isAuthorized } from '../middlewares/isAuthorized';

const router = Router();

// Inyección de Dependencias
const userRepository = new SequelizeUserRepository();
const refreshTokenRepository = new SequelizeRefreshTokenRepository();
const mesaRepository = new SequelizeMesaRepository();
const orderRepository = new SequelizeOrderRepository();
const passwordHasher = new BcryptHasher();
const tokenService = new JwtService();

const loginUseCase = new Login(userRepository, passwordHasher, tokenService, refreshTokenRepository);
const logoutUseCase = new Logout(refreshTokenRepository);
const registerUseCase = new Register(userRepository, passwordHasher);
const requestCheckInUseCase = new RequestCheckIn(mesaRepository);
const approveCheckInUseCase = new ApproveCheckIn(tokenService, mesaRepository, orderRepository);

const authController = new AuthController(
  loginUseCase,
  logoutUseCase,
  registerUseCase,
  requestCheckInUseCase,
  approveCheckInUseCase
);


// Middlewares instanciados para uso global
export const authGuard = isAuthenticated(tokenService, refreshTokenRepository);
export const roleGuard = isAuthorized;

// Rutas Públicas / Registro y Login
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

// Rutas de Comensal (Check-In)
router.post('/checkin/request', (req, res) => authController.requestCheckIn(req, res));

// Rutas de Staff (Requieren estar logueado como Admin/Mozo)
router.post('/checkin/approve', authGuard, (req, res) => authController.approveCheckIn(req, res));

export { router as AuthRouter };
