import type { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../../infrastructure/config/env/env.validation.js';

export function buildDatabaseUrl(
  configService: ConfigService<EnvironmentVariables, true>,
): string {
  const host = configService.get('DATABASE_HOST', { infer: true });
  const port = configService.get('DATABASE_PORT', { infer: true });
  const user = configService.get('DATABASE_USER', { infer: true });
  const password = configService.get('DATABASE_PASSWORD', { infer: true });
  const name = configService.get('DATABASE_NAME', { infer: true });

  return `postgresql://${user}:${password}@${host}:${port}/${name}`;
}
