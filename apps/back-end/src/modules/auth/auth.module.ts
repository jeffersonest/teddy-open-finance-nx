import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordHasher } from '../users/domain/interfaces/password-hasher.js';
import { UserRepository } from '../users/domain/interfaces/user.repository.js';
import { UsersModule } from '../users/users.module.js';
import { LoginUseCase } from './application/use_cases/login.use-case.js';
import { RefreshTokenUseCase } from './application/use_cases/refresh-token.use-case.js';
import { AuthController } from './api/controllers/auth.controller.js';
import { TokenIssuer } from './domain/interfaces/token-issuer.js';
import { JwtAuthGuard } from './infrastructure/jwt/jwt-auth.guard.js';
import { JwtTokenIssuer } from './infrastructure/jwt/jwt-token-issuer.js';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy.js';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: TokenIssuer,
      useClass: JwtTokenIssuer,
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepo: UserRepository,
        hasher: PasswordHasher,
        tokenIssuer: TokenIssuer,
      ) => new LoginUseCase(userRepo, hasher, tokenIssuer),
      inject: [UserRepository, PasswordHasher, TokenIssuer],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (tokenIssuer: TokenIssuer, userRepo: UserRepository) =>
        new RefreshTokenUseCase(tokenIssuer, userRepo),
      inject: [TokenIssuer, UserRepository],
    },
  ],
  exports: [JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
