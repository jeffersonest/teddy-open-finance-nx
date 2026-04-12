import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import type { RefreshTokenRequest } from '@teddy-open-finance/contracts';

export class RefreshTokenDto implements RefreshTokenRequest {
  @ApiProperty()
  @IsString()
  refreshToken!: string;
}
