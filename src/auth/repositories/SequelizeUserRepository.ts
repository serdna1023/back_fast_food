import { UsuarioModel, RolModel } from '../../SequelizeModels'
import { User } from '../entities/User'
import { UserMapper } from '../mappers/UserMapper'
import { IUserRepository } from './IUserRepository'

export class SequelizeUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const model = await UsuarioModel.findOne({
      where: { email },
      include: [{ model: RolModel, as: 'roles' }]
    })

    if (!model) return null

    return UserMapper.toEntity(model)
  }

  async findById(id: string): Promise<User | null> {
    const model = await UsuarioModel.findByPk(id, {
      include: [{ model: RolModel, as: 'roles' }]
    })

    if (!model) return null

    return UserMapper.toEntity(model)
  }

  async save(user: User): Promise<User> {
    const persistence = UserMapper.toPersistence(user)
    const [model] = await UsuarioModel.upsert(persistence)

    return UserMapper.toEntity(model)
  }
}
