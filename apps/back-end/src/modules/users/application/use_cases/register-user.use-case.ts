import { User } from '../../domain/entities/user.js';
import { EmailAlreadyExistsError } from '../../domain/errors/email-already-exists.error.js';
import { PasswordHasher } from '../../domain/interfaces/password-hasher.js';
import { UserRepository } from '../../domain/interfaces/user.repository.js';

export interface RegisterUserCommand {
  email: string;
  name: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new EmailAlreadyExistsError(command.email);
    }

    const passwordHash = await this.passwordHasher.hash(command.password);

    return this.userRepository.create({
      email: command.email,
      name: command.name,
      passwordHash,
    });
  }
}
