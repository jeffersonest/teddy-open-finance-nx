import { EntitySchema } from 'typeorm';

export interface ClientPersistenceModel {
  id: string;
  name: string;
  salary: number;
  companyValuation: number;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const ClientSchema = new EntitySchema<ClientPersistenceModel>({
  name: 'Client',
  tableName: 'clients',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: 255,
    },
    salary: {
      type: 'numeric',
      precision: 14,
      scale: 2,
      transformer: {
        to: (value: number) => value,
        from: (value: string) => Number(value),
      },
    },
    companyValuation: {
      name: 'company_valuation',
      type: 'numeric',
      precision: 16,
      scale: 2,
      transformer: {
        to: (value: number) => value,
        from: (value: string) => Number(value),
      },
    },
    accessCount: {
      name: 'access_count',
      type: 'integer',
      default: 0,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamptz',
      updateDate: true,
    },
    deletedAt: {
      name: 'deleted_at',
      type: 'timestamptz',
      nullable: true,
      deleteDate: true,
    },
  },
  indices: [
    {
      name: 'idx_clients_name',
      columns: ['name'],
    },
  ],
});
