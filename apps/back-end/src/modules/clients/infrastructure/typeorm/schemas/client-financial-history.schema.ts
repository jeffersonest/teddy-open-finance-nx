import type { ClientFinancialHistoryField } from '@teddy-open-finance/contracts';
import { EntitySchema } from 'typeorm';

export interface ClientFinancialHistoryPersistenceModel {
  id: string;
  clientId: string;
  field: ClientFinancialHistoryField;
  previousValue: number;
  newValue: number;
  changedAt: Date;
}

export const ClientFinancialHistorySchema = new EntitySchema<ClientFinancialHistoryPersistenceModel>({
  name: 'ClientFinancialHistory',
  tableName: 'client_financial_history',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    clientId: {
      name: 'client_id',
      type: 'uuid',
    },
    field: {
      type: 'varchar',
      length: 32,
    },
    previousValue: {
      name: 'previous_value',
      type: 'numeric',
      precision: 16,
      scale: 2,
      transformer: {
        to: (value: number) => value,
        from: (value: string) => Number(value),
      },
    },
    newValue: {
      name: 'new_value',
      type: 'numeric',
      precision: 16,
      scale: 2,
      transformer: {
        to: (value: number) => value,
        from: (value: string) => Number(value),
      },
    },
    changedAt: {
      name: 'changed_at',
      type: 'timestamptz',
    },
  },
});
