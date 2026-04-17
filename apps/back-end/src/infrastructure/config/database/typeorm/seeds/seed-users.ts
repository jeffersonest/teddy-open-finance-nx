import * as bcrypt from 'bcrypt';
import { config as loadEnv } from 'dotenv';
import { join } from 'node:path';
import { dataSource } from '../typeorm.config.js';
import {
  UserPersistenceModel,
  UserSchema,
} from '../../../../../modules/users/infrastructure/typeorm/schemas/user.schema.js';

const firstNames = [
  'Adriana',
  'Aline',
  'Amanda',
  'Bruna',
  'Camila',
  'Carolina',
  'Cristiane',
  'Daniela',
  'Eduarda',
  'Fernanda',
  'Gabriela',
  'Helena',
  'Isadora',
  'Juliana',
  'Larissa',
  'Leticia',
  'Luana',
  'Marcela',
  'Marina',
  'Natasha',
  'Patricia',
  'Priscila',
  'Renata',
  'Sabrina',
  'Tatiane',
  'Vanessa',
  'Vinicius',
  'Bruno',
  'Caio',
  'Diego',
  'Eduardo',
  'Felipe',
  'Gustavo',
  'Henrique',
  'Igor',
  'Joao',
  'Leonardo',
  'Lucas',
  'Marcelo',
  'Matheus',
  'Nicolas',
  'Otavio',
  'Paulo',
  'Rafael',
  'Ricardo',
  'Rodrigo',
  'Samuel',
  'Thiago',
  'Victor',
  'Yuri',
];

const lastNames = [
  'Almeida',
  'Araujo',
  'Barbosa',
  'Batista',
  'Cardoso',
  'Costa',
  'Duarte',
  'Esteves',
  'Ferreira',
  'Freitas',
  'Goncalves',
  'Lacerda',
  'Lima',
  'Macedo',
  'Martins',
  'Melo',
  'Monteiro',
  'Moraes',
  'Nogueira',
  'Novaes',
  'Oliveira',
  'Pereira',
  'Queiroz',
  'Ramos',
  'Rezende',
  'Ribeiro',
  'Santos',
  'Silva',
  'Sousa',
  'Tavares',
  'Teixeira',
  'Vieira',
];

async function seedUsers() {
  loadEnv({ path: join(process.cwd(), '.env') });
  loadEnv({ path: join(process.cwd(), '..', '.env'), override: false });

  const requestedCount = Number(process.env.SEED_USERS_COUNT ?? '50');
  const seedCount = Number.isFinite(requestedCount) && requestedCount > 0
    ? Math.floor(requestedCount)
    : 50;
  const defaultPassword = process.env.SEED_USERS_PASSWORD ?? 'Teddy@123';

  await dataSource.initialize();
  await dataSource.runMigrations();

  const repository = dataSource.getRepository<UserPersistenceModel>(UserSchema);
  const existingCount = await repository.count();
  const passwordHash = await bcrypt.hash(defaultPassword, 10);
  const users = Array.from(
    { length: seedCount },
    (_, index) => createUserRecord(existingCount + index + 1, passwordHash),
  );

  await repository.insert(users);

  console.log(
    `Inserted ${users.length} users. Total seeded rows: ${existingCount + users.length}. Default password: ${defaultPassword}`,
  );

  await dataSource.destroy();
}

function createUserRecord(sequence: number, passwordHash: string) {
  const firstName = firstNames[(sequence - 1) % firstNames.length];
  const lastName = lastNames[
    Math.floor((sequence - 1) / firstNames.length) % lastNames.length
  ];
  const normalizedFirstName = normalizeForEmail(firstName);
  const normalizedLastName = normalizeForEmail(lastName);

  return {
    email: `${normalizedFirstName}.${normalizedLastName}.${String(sequence).padStart(3, '0')}@teddy.local`,
    name: `${firstName} ${lastName}`,
    passwordHash,
  };
}

function normalizeForEmail(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

seedUsers().catch(async (error: unknown) => {
  console.error('Failed to seed users.', error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});
