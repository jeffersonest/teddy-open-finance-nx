import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateClientFinancialHistoryTable1744500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'client_financial_history',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'client_id',
            type: 'uuid',
          },
          {
            name: 'field',
            type: 'varchar',
            length: '32',
          },
          {
            name: 'previous_value',
            type: 'numeric',
            precision: 16,
            scale: 2,
          },
          {
            name: 'new_value',
            type: 'numeric',
            precision: 16,
            scale: 2,
          },
          {
            name: 'changed_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'client_financial_history',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedTableName: 'clients',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'client_financial_history',
      new TableIndex({
        name: 'idx_client_financial_history_client_id_changed_at',
        columnNames: ['client_id', 'changed_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'client_financial_history',
      'idx_client_financial_history_client_id_changed_at',
    );

    const financialHistoryTable = await queryRunner.getTable('client_financial_history');
    const clientForeignKey = financialHistoryTable?.foreignKeys.find(
      (foreignKey) => foreignKey.columnNames[0] === 'client_id',
    );

    if (clientForeignKey) {
      await queryRunner.dropForeignKey('client_financial_history', clientForeignKey);
    }

    await queryRunner.dropTable('client_financial_history');
  }
}
