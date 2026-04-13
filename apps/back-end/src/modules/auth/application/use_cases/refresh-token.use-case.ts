import { UserRepository } from '../../../users/domain/interfaces/user.repository.js';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import { TokenIssuer } from '../../domain/interfaces/token-issuer.js';

export interface RefreshTokenResult {
  accessToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenIssuer: TokenIssuer,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(token: string): Promise<RefreshTokenResult> {
    let payload: { sub: string };
    try {
      payload = this.tokenIssuer.verifyRefreshToken(token);
    } catch {
      throw new InvalidCredentialsError();
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenIssuer.issueAccessToken({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
