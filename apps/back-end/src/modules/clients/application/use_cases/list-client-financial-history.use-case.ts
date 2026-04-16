import { ClientNotFoundError } from '../../domain/errors/client-not-found.error.js';
import { ClientFinancialHistoryEntry } from '../../domain/entities/client-financial-history-entry.js';
import { ClientFinancialHistoryRepository } from '../../domain/interfaces/client-financial-history.repository.js';
import { ClientRepository } from '../../domain/interfaces/client.repository.js';

export class ListClientFinancialHistoryUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly clientFinancialHistoryRepository: ClientFinancialHistoryRepository,
  ) {}

  async execute(clientId: string): Promise<ClientFinancialHistoryEntry[]> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new ClientNotFoundError(clientId);
    }

    return this.clientFinancialHistoryRepository.listByClientId(clientId);
  }
}
