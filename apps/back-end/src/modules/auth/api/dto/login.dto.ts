import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import type { LoginRequest } from '@teddy-open-finance/contracts';

export class LoginDto implements LoginRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Str0ngP@ss!' })
  @IsString()
  password!: string;
}
