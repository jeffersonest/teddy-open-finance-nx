import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EnvironmentVariables } from '../../env/env.validation.js';
import { CreateClientsTable1744200000000 } from './migrations/1744200000000-CreateClientsTable.js';
import { CreateUsersTable1744300000000 } from './migrations/1744300000000-CreateUsersTable.js';
import { AddSoftDeleteToClients1744400000000 } from './migrations/1744400000000-AddSoftDeleteToClients.js';
import { CreateClientFinancialHistoryTable1744500000000 } from './migrations/1744500000000-CreateClientFinancialHistoryTable.js';

const migrations = [
  CreateClientsTable1744200000000,
  CreateUsersTable1744300000000,
  AddSoftDeleteToClients1744400000000,
  CreateClientFinancialHistoryTable1744500000000,
];

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
    join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'modules',
      '**',
      'infrastructure',
      'typeorm',
      'schemas',
      '*.schema.{ts,js}',
    ),
  ],
  migrations,
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: configService.get('DATABASE_RUN_MIGRATIONS', { infer: true }),
  logging: configService.get('NODE_ENV', { infer: true }) === 'development',
});

loadEnv();
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'modules',
      '**',
      'infrastructure',
      'typeorm',
      'schemas',
      '*.schema.{ts,js}',
    ),
  ],
  migrations,
} satisfies DataSourceOptions);
