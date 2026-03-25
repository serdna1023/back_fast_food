import { User } from '../entities/User';

export class UserMapper {
  static toEntity(model: any): User {
    return new User(
      model.id,
      model.restaurantId,
      model.username,
      model.email,
      model.passwordHash,
      model.roles?.map((r: any) => r.nombre) || [],
      model.activo
    )
  }

  static toPersistence(user: User): any {
    return {
      id: user.id,
      restaurantId: user.restaurantId,
      username: user.username,
      email: user.email,
      password_hash: user.passwordHash,
      activo: user.active
    }
  }
}
