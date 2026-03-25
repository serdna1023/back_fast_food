export interface ITokenService {
  generateToken(payload: object, expiresIn: string | number): string;
  verifyToken<T>(token: string): T;
}
