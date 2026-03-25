import * as jwt from 'jsonwebtoken'
import { ITokenService } from './ITokenService'

export class JwtService implements ITokenService {
  private readonly secret: string

  constructor() {
    this.secret = process.env.JWT_SECRET || 'super-secret-key-change-me'
  }

  generateToken(payload: object, expiresIn: string | number): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn']
    })
  }

  verifyToken<T>(token: string): T {
    try {
      return jwt.verify(token, this.secret) as T
    } catch (error: any) {
      throw new Error(error.message || 'Token inválido o expirado')
    }
  }
}
