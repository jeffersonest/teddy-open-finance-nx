import { ApiProperty } from '@nestjs/swagger';
import type {
  AuthenticatedUser,
  LoginResponse,
  RefreshTokenResponse,
} from '@teddy-open-finance/contracts';

export class AuthenticatedUserDto implements AuthenticatedUser {
  @ApiProperty() id!: string;
  @ApiProperty() email!: string;
  @ApiProperty() name!: string;
}

export class LoginResponseDto implements LoginResponse {
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
  @ApiProperty({ type: AuthenticatedUserDto }) user!: AuthenticatedUserDto;
}

export class RefreshTokenResponseDto implements RefreshTokenResponse {
  @ApiProperty() accessToken!: string;
}
