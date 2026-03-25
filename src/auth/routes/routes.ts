import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Login } from '../use-cases/Login';
import { Logout } from '../use-cases/Logout';
import { SequelizeUserRepository } from '../repositories/SequelizeUserRepository';
import { SequelizeRefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { BcryptHasher } from '../security/BcryptHasher';
import { JwtService } from '../security/JwtService';

const router = Router();

// Inyección de Dependencias
const userRepository = new SequelizeUserRepository();
const refreshTokenRepository = new SequelizeRefreshTokenRepository();
const passwordHasher = new BcryptHasher();
const tokenService = new JwtService();

const loginUseCase = new Login(userRepository, passwordHasher, tokenService, refreshTokenRepository);
const logoutUseCase = new Logout(refreshTokenRepository);
const authController = new AuthController(loginUseCase, logoutUseCase);

// Rutas
router.post('/login', (req, res) => authController.login(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
