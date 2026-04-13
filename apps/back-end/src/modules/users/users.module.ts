import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserUseCase } from './application/use_cases/register-user.use-case.js';
import { PasswordHasher } from './domain/interfaces/password-hasher.js';
import { UserRepository } from './domain/interfaces/user.repository.js';
import { BcryptPasswordHasher } from './infrastructure/bcrypt/bcrypt-password-hasher.js';
import { TypeOrmUserRepository } from './infrastructure/typeorm/repositories/typeorm-user.repository.js';
import { UserSchema } from './infrastructure/typeorm/schemas/user.schema.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (repo: UserRepository, hasher: PasswordHasher) =>
        new RegisterUserUseCase(repo, hasher),
      inject: [UserRepository, PasswordHasher],
    },
  ],
  exports: [UserRepository, PasswordHasher, RegisterUserUseCase],
})
export class UsersModule {}
