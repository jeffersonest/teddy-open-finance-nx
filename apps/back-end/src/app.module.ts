import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { validateEnv } from './infrastructure/config/env/env.validation';
import { typeOrmFactory } from './infrastructure/config/database/typeorm.config';
import { HealthModule } from './infrastructure/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['.env', 'apps/back-end/.env'],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === 'development'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        autoLogging: true,
        redact: ['req.headers.authorization'],
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmFactory,
    }),
    HealthModule,
  ],
})
export class AppModule {}
