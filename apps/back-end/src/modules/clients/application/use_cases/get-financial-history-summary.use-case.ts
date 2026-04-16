import type { ClientFinancialHistoryField } from '@teddy-open-finance/contracts';
import { ClientFinancialHistoryRepository } from '../../domain/interfaces/client-financial-history.repository.js';

export interface FinancialHistorySummaryItem {
  clientId: string;
  field: ClientFinancialHistoryField;
  increases: number;
  decreases: number;
  totalVariation: number;
}

export class GetFinancialHistorySummaryUseCase {
  constructor(
    private readonly financialHistoryRepository: ClientFinancialHistoryRepository,
  ) {}

  async execute(field?: ClientFinancialHistoryField): Promise<FinancialHistorySummaryItem[]> {
    const entries = await this.financialHistoryRepository.listAll(field);

    const grouped = new Map<string, FinancialHistorySummaryItem>();

    for (const entry of entries) {
      const key = `${entry.clientId}:${entry.field}`;
      const existing = grouped.get(key);
      const diff = entry.newValue - entry.previousValue;

      if (!existing) {
        grouped.set(key, {
          clientId: entry.clientId,
          field: entry.field,
          increases: diff > 0 ? 1 : 0,
          decreases: diff < 0 ? 1 : 0,
          totalVariation: diff,
        });
        continue;
      }

      existing.increases += diff > 0 ? 1 : 0;
      existing.decreases += diff < 0 ? 1 : 0;
      existing.totalVariation += diff;
    }

    return Array.from(grouped.values());
  }
}
