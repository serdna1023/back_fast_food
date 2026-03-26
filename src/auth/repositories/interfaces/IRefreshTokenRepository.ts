export interface IRefreshTokenRepository {
  save(userId: string, token: string, expiresAt: Date): Promise<void>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  findByToken(token: string): Promise<any | null>;
}
