import { RefreshTokenModel } from '../../SequelizeModels'

export interface IRefreshTokenRepository {
  save(userId: string, token: string, expiresAt: Date): Promise<void>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  findByToken(token: string): Promise<any | null>;
}

export class SequelizeRefreshTokenRepository implements IRefreshTokenRepository {
  async save(userId: string, token: string, expiresAt: Date): Promise<void> {
    await RefreshTokenModel.create({
      userId,
      token,
      expiresAt
    })
  }

  async deleteByToken(token: string): Promise<void> {
    await RefreshTokenModel.destroy({ where: { token } })
  }

  async deleteByUserId(userId: string): Promise<void> {
    await RefreshTokenModel.destroy({ where: { userId } })
  }

  async findByToken(token: string): Promise<any | null> {
    return RefreshTokenModel.findOne({ where: { token } })
  }
}
