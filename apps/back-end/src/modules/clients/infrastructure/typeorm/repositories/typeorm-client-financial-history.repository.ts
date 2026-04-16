import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ClientFinancialHistoryRepository,
  CreateClientFinancialHistoryEntryInput,
} from '../../../domain/interfaces/client-financial-history.repository.js';
import { ClientFinancialHistoryEntry } from '../../../domain/entities/client-financial-history-entry.js';
import {
  ClientFinancialHistoryPersistenceModel,
  ClientFinancialHistorySchema,
} from '../schemas/client-financial-history.schema.js';

@Injectable()
export class TypeOrmClientFinancialHistoryRepository extends ClientFinancialHistoryRepository {
  constructor(
    @InjectRepository(ClientFinancialHistorySchema)
    private readonly repository: Repository<ClientFinancialHistoryPersistenceModel>,
  ) {
    super();
  }

  async createMany(
    entries: CreateClientFinancialHistoryEntryInput[],
  ): Promise<ClientFinancialHistoryEntry[]> {
    if (entries.length === 0) {
      return [];
    }

    const rows = this.repository.create(
      entries.map((entry) => ({
        clientId: entry.clientId,
        field: entry.field,
        previousValue: entry.previousValue,
        newValue: entry.newValue,
        changedAt: entry.changedAt,
      })),
    );
    const savedRows = await this.repository.save(rows);
    return savedRows.map((savedRow) => this.toDomain(savedRow));
  }

  async listByClientId(clientId: string): Promise<ClientFinancialHistoryEntry[]> {
    const rows = await this.repository.find({
      where: { clientId },
      order: {
        changedAt: 'DESC',
        id: 'DESC',
      },
    });
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: ClientFinancialHistoryPersistenceModel): ClientFinancialHistoryEntry {
    return new ClientFinancialHistoryEntry({
      id: row.id,
      clientId: row.clientId,
      field: row.field,
      previousValue: Number(row.previousValue),
      newValue: Number(row.newValue),
      changedAt: row.changedAt,
    });
  }
}
