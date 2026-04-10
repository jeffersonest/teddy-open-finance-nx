import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateClientsTable1744200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'clients',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'salary', type: 'numeric', precision: 14, scale: 2 },
          {
            name: 'company_valuation',
            type: 'numeric',
            precision: 16,
            scale: 2,
          },
          { name: 'access_count', type: 'integer', default: 0 },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'clients',
      new TableIndex({
        name: 'idx_clients_name',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('clients', 'idx_clients_name');
    await queryRunner.dropTable('clients');
  }
}
