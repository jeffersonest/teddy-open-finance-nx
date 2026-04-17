import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { EnvironmentVariables } from '../../../../infrastructure/config/env/env.validation.js';
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
import {
  getRefreshTokenClearCookieOptions,
  getRefreshTokenCookieName,
  getRefreshTokenCookieOptions,
} from '../refresh-token-cookie.js';
import { AuthExceptionFilter } from '../filters/auth-exception.filter.js';

@ApiTags('auth')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
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
  async handleLogin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.login.execute(dto);
    response.cookie(
      getRefreshTokenCookieName(),
      result.refreshToken,
      getRefreshTokenCookieOptions(this.getRefreshTokenCookieEnvironment()),
    );

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RefreshTokenResponseDto })
  async handleRefresh(
    @Body() _dto: RefreshTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponseDto> {
    try {
      return await this.refreshToken.execute(
        request.cookies?.[getRefreshTokenCookieName()],
      );
    } catch (error) {
      response.clearCookie(
        getRefreshTokenCookieName(),
        getRefreshTokenClearCookieOptions(this.getRefreshTokenCookieEnvironment()),
      );
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logged out successfully' })
  handleLogout(@Res({ passthrough: true }) response: Response): { message: string } {
    response.clearCookie(
      getRefreshTokenCookieName(),
      getRefreshTokenClearCookieOptions(this.getRefreshTokenCookieEnvironment()),
    );

    return { message: 'User logged out successfully' };
  }

  private getRefreshTokenCookieEnvironment() {
    return {
      NODE_ENV: this.configService.getOrThrow('NODE_ENV', { infer: true }),
      JWT_REFRESH_EXPIRES_IN: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN', {
        infer: true,
      }),
    };
  }
}
