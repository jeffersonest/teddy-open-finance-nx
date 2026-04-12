import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { join } from 'node:path';
import { EnvironmentVariables } from '../../env/env.validation.js';

export const typeOrmFactory = (
  configService: ConfigService<EnvironmentVariables, true>,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', { infer: true }),
  port: configService.get('DATABASE_PORT', { infer: true }),
  username: configService.get('DATABASE_USER', { infer: true }),
  password: configService.get('DATABASE_PASSWORD', { infer: true }),
  database: configService.get('DATABASE_NAME', { infer: true }),
  entities: [
    join(__dirname, '..', '..', '..', '..', 'modules', '**', 'infrastructure', 'typeorm', 'schemas', '*.schema.{ts,js}'),
  ],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: configService.get('DATABASE_RUN_MIGRATIONS', { infer: true }),
  logging: configService.get('NODE_ENV', { infer: true }) === 'development',
});

// DataSource used by the TypeORM CLI for migrations (outside Nest DI).
loadEnv();
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    join(__dirname, '..', '..', '..', '..', 'modules', '**', 'infrastructure', 'typeorm', 'schemas', '*.schema.{ts,js}'),
  ],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
} satisfies DataSourceOptions);
