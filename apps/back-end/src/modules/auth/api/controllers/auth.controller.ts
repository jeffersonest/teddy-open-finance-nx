import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../../users/application/use_cases/register-user.use-case.js';
import { LoginUseCase } from '../../application/use_cases/login.use-case.js';
import { RefreshTokenUseCase } from '../../application/use_cases/refresh-token.use-case.js';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
} from '../dto/auth-response.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { RefreshTokenDto } from '../dto/refresh-token.dto.js';
import { RegisterDto } from '../dto/register.dto.js';
import { AuthExceptionFilter } from '../filters/auth-exception.filter.js';

@ApiTags('auth')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly login: LoginUseCase,
    private readonly refreshToken: RefreshTokenUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User registered successfully' })
  async register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    await this.registerUser.execute(dto);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponseDto })
  async handleLogin(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.login.execute(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RefreshTokenResponseDto })
  async handleRefresh(@Body() dto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    return this.refreshToken.execute(dto.refreshToken);
  }
}
