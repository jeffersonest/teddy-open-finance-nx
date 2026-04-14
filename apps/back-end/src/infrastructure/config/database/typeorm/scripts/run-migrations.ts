import { config as loadEnv } from 'dotenv';
import { join } from 'node:path';
import { dataSource } from '../typeorm.config.js';

const REQUIRED_MIGRATIONS = 3;

async function runMigrations(): Promise<void> {
  loadEnv({ path: join(process.cwd(), '.env') });
  loadEnv({ path: join(process.cwd(), '..', '.env'), override: false });

  await dataSource.initialize();

  try {
    const executedMigrations = await dataSource.runMigrations();
    const [{ count }] = (await dataSource.query(
      'SELECT count(*)::int AS count FROM migrations',
    )) as Array<{ count: number }>;

    if (count < REQUIRED_MIGRATIONS) {
      throw new Error(
        `Expected at least ${REQUIRED_MIGRATIONS} registered migrations, found ${count}.`,
      );
    }

    console.log(
      `Migrations executed: ${executedMigrations.length}. Registered migrations: ${count}.`,
    );
  } finally {
    await dataSource.destroy();
  }
}

runMigrations().catch((error: unknown) => {
  console.error('Migration execution failed.', error);
  process.exit(1);
});
