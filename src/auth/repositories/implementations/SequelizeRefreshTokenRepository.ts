import { RefreshTokenModel } from '../../../SequelizeModels'
import { IRefreshTokenRepository } from '../interfaces/IRefreshTokenRepository'

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
