import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import {
  EnvironmentVariables,
  validateEnv,
} from './infrastructure/config/env/env.validation.js';
import { typeOrmFactory } from './infrastructure/config/database/typeorm/typeorm.config.js';
import { HealthModule } from './infrastructure/health/health.module.js';
import { MetricsModule } from './infrastructure/metrics/metrics.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ClientsModule } from './modules/clients/clients.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: ['.env', 'apps/back-end/.env'],
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        pinoHttp: {
          level: configService.get('LOG_LEVEL', { infer: true }),
          autoLogging: true,
          genReqId: (request) =>
            request.headers['x-request-id']?.toString() ?? randomUUID(),
          transport: configService.get('LOG_PRETTY', { infer: true })
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                  ignore: 'pid,hostname',
                  levelFirst: true,
                  singleLine: false,
                },
              }
            : undefined,
          redact: ['req.headers.authorization'],
          customProps: () => ({
            application: configService.get('LOG_APP_NAME', { infer: true }),
            environment: configService.get('NODE_ENV', { infer: true }),
          }),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmFactory,
    }),
    HealthModule,
    MetricsModule,
    AuthModule,
    ClientsModule,
  ],
})
export class AppModule {}
