import { User } from '../entities/User';

export class UserMapper {
  static toEntity(model: any): User {
    const roles = model.roles?.map((r: any) => r.nombre) || []
    const permissions = model.roles?.flatMap((r: any) => r.permisos?.map((p: any) => p.nombre) || []) || []
    
    return new User(
      model.id,
      model.restaurantId,
      model.username,
      model.email,
      model.passwordHash,
      roles,
      [...new Set(permissions)] as string[], // Eliminar duplicados si un permiso está en varios roles
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
