import { Client } from '../../domain/entities/client.js';
import {
  ClientFinancialHistoryRepository,
  CreateClientFinancialHistoryEntryInput,
} from '../../domain/interfaces/client-financial-history.repository.js';
import { ClientNotFoundError } from '../../domain/errors/client-not-found.error.js';
import { ClientRepository } from '../../domain/interfaces/client.repository.js';

export interface UpdateClientCommand {
  id: string;
  name?: string;
  salary?: number;
  companyValuation?: number;
}

export class UpdateClientUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly clientFinancialHistoryRepository: ClientFinancialHistoryRepository,
  ) {}

  async execute(command: UpdateClientCommand): Promise<Client> {
    const client = await this.clientRepository.findById(command.id);
    if (!client) {
      throw new ClientNotFoundError(command.id);
    }

    const financialHistoryEntries = this.buildFinancialHistoryEntries(client, command);

    if (command.name !== undefined) {
      client.rename(command.name);
    }
    if (command.salary !== undefined) {
      client.updateSalary(command.salary);
    }
    if (command.companyValuation !== undefined) {
      client.updateCompanyValuation(command.companyValuation);
    }

    const savedClient = await this.clientRepository.save(client);
    const historyEntriesToPersist = financialHistoryEntries.map((entry) => ({
      ...entry,
      clientId: savedClient.id,
      changedAt: savedClient.updatedAt,
    }));

    await this.clientFinancialHistoryRepository.createMany(historyEntriesToPersist);

    return savedClient;
  }

  private buildFinancialHistoryEntries(
    client: Client,
    command: UpdateClientCommand,
  ): CreateClientFinancialHistoryEntryInput[] {
    const financialHistoryEntries: CreateClientFinancialHistoryEntryInput[] = [];

    if (command.salary !== undefined && command.salary !== client.salary) {
      financialHistoryEntries.push({
        clientId: client.id,
        field: 'salary',
        previousValue: client.salary,
        newValue: command.salary,
        changedAt: client.updatedAt,
      });
    }

    if (
      command.companyValuation !== undefined &&
      command.companyValuation !== client.companyValuation
    ) {
      financialHistoryEntries.push({
        clientId: client.id,
        field: 'companyValuation',
        previousValue: client.companyValuation,
        newValue: command.companyValuation,
        changedAt: client.updatedAt,
      });
    }

    return financialHistoryEntries;
  }
}
