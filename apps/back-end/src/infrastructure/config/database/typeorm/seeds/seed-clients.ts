import { config as loadEnv } from 'dotenv';
import { join } from 'node:path';
import { dataSource } from '../typeorm.config.js';
import {
  ClientPersistenceModel,
  ClientSchema,
} from '../../../../../modules/clients/infrastructure/typeorm/schemas/client.schema.js';

const firstNames = [
  'Ana',
  'Bruno',
  'Carla',
  'Daniel',
  'Eduarda',
  'Felipe',
  'Gabriela',
  'Henrique',
  'Isabela',
  'Joao',
  'Karina',
  'Lucas',
  'Mariana',
  'Nicolas',
  'Olivia',
  'Paulo',
  'Quiteria',
  'Rafael',
  'Sabrina',
  'Thiago',
  'Ursula',
  'Valentina',
  'William',
  'Xavier',
  'Yasmin',
  'Zeca',
];

const lastNames = [
  'Almeida',
  'Barbosa',
  'Cardoso',
  'Dias',
  'Esteves',
  'Ferreira',
  'Gomes',
  'Henriques',
  'Ibrahim',
  'Jardim',
  'Klein',
  'Lemos',
  'Moraes',
  'Nascimento',
  'Oliveira',
  'Pereira',
  'Queiroz',
  'Ribeiro',
  'Souza',
  'Teixeira',
  'Uchoa',
  'Vieira',
  'Werneck',
  'Ximenes',
  'Yamamoto',
  'Zanetti',
];

async function seedClients() {
  loadEnv({ path: join(process.cwd(), '.env') });
  loadEnv({ path: join(process.cwd(), '..', '.env'), override: false });

  const requestedCount = Number(process.env.SEED_CLIENTS_COUNT ?? '50');
  const seedCount = Number.isFinite(requestedCount) && requestedCount > 0
    ? Math.floor(requestedCount)
    : 50;

  await dataSource.initialize();
  await dataSource.runMigrations();

  const repository = dataSource.getRepository<ClientPersistenceModel>(ClientSchema);
  const existingCount = await repository.count({ withDeleted: true });
  const clients = Array.from({ length: seedCount }, (_, index) =>
    createClientRecord(existingCount + index + 1),
  );

  await repository.insert(clients);

  console.log(
    `Inserted ${clients.length} clients. Total seeded rows: ${existingCount + clients.length}.`,
  );

  await dataSource.destroy();
}

function createClientRecord(sequence: number) {
  const firstName = firstNames[(sequence - 1) % firstNames.length];
  const lastName = lastNames[
    Math.floor((sequence - 1) / firstNames.length) % lastNames.length
  ];
  const salary = 3_500 + sequence * 137.45;
  const companyValuation = 250_000 + sequence * 12_345.67;

  return {
    name: `${firstName} ${lastName} ${String(sequence).padStart(3, '0')}`,
    salary: Number(salary.toFixed(2)),
    companyValuation: Number(companyValuation.toFixed(2)),
    accessCount: 0,
  };
}

seedClients().catch(async (error: unknown) => {
  console.error('Failed to seed clients.', error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});
