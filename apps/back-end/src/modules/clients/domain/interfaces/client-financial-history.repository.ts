import type { ClientFinancialHistoryField } from '@teddy-open-finance/contracts';
import { ClientFinancialHistoryEntry } from '../entities/client-financial-history-entry.js';

export interface CreateClientFinancialHistoryEntryInput {
  clientId: string;
  field: ClientFinancialHistoryField;
  previousValue: number;
  newValue: number;
  changedAt: Date;
}

export abstract class ClientFinancialHistoryRepository {
  abstract createMany(
    entries: CreateClientFinancialHistoryEntryInput[],
  ): Promise<ClientFinancialHistoryEntry[]>;
  abstract listByClientId(clientId: string): Promise<ClientFinancialHistoryEntry[]>;
  abstract listAll(field?: ClientFinancialHistoryField): Promise<ClientFinancialHistoryEntry[]>;
}
