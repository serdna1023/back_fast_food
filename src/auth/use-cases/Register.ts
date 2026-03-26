import { User } from '../entities/User';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IPasswordHasher } from '../security/IPasswordHasher';
import { v4 as uuidv4 } from 'uuid';
import { RegisterRequest } from '../dtos/RegisterDTO';

export class Register {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(request: RegisterRequest): Promise<User> {
    const { email, password, username, restaurantId, roles } = request;

    // 1. Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // 2. Hashear la contraseña
    const passwordHash = await this.passwordHasher.hash(password);

    // 3. Crear entidad de usuario
    const newUser = new User(
      uuidv4(),
      restaurantId,
      username,
      email,
      passwordHash,
      roles || [] // Los roles se asignarán mediante una tabla intermedia en el repositorio
    );

    // 4. Guardar en base de datos
    return this.userRepository.save(newUser);
  }
}
