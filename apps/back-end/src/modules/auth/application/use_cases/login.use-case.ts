import { PasswordHasher } from '../../../users/domain/interfaces/password-hasher.js';
import { UserRepository } from '../../../users/domain/interfaces/user.repository.js';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import { TokenIssuer } from '../../domain/interfaces/token-issuer.js';

export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string };
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenIssuer: TokenIssuer,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const valid = await this.passwordHasher.compare(command.password, user.passwordHash);
    if (!valid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenIssuer.issueAccessToken({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = this.tokenIssuer.issueRefreshToken({
      sub: user.id,
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
