import bcrypt from 'bcryptjs'
import { IPasswordHasher } from './IPasswordHasher'

export class BcryptHasher implements IPasswordHasher {
  private readonly saltRounds = 12

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
