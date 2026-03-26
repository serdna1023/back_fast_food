import { Request, Response, NextFunction } from 'express'
import { ITokenService } from '../security/ITokenService'
import { IRefreshTokenRepository } from '../repositories/interfaces/IRefreshTokenRepository'

export interface UserPayload {
  id: string
  restaurantId: string
  roles: string[]
  permissions: string[]
}

// Extendemos Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}

export const isAuthenticated = (
  tokenService: ITokenService,
  refreshTokenRepo: IRefreshTokenRepository
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies['auth_token']
      if (!token) {
        res.status(401).json({ error: 'No autorizado: Falta token de sesión' })
        return
      }

      const payload = tokenService.verifyToken<any>(token)
      if (!payload) {
        res.status(401).json({ error: 'No autorizado: Token inválido' })
        return
      }

      const session = await refreshTokenRepo.findByToken(token)
      if (!session) {
        res.status(401).json({ error: 'No autorizado: Sesión expirada o cerrada' })
      }
      // 4. Inyectar datos del usuario en el Request
      req.user = {
        id: payload.sub,
        restaurantId: payload.restaurantId,
        roles: payload.roles,
        permissions: payload.permissions || []
      }

      next()
    } catch (error: any) {
      res.status(401).json({ error: 'Sesión inválida' })
    }
  }
}
