import { Client } from '../../domain/entities/client.js';
import { ClientNotFoundError } from '../../domain/errors/client-not-found.error.js';
import { ClientRepository } from '../../domain/interfaces/client.repository.js';

export interface UpdateClientCommand {
  id: string;
  name?: string;
  salary?: number;
  companyValuation?: number;
}

export class UpdateClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(command: UpdateClientCommand): Promise<Client> {
    const client = await this.clientRepository.findById(command.id);
    if (!client) {
      throw new ClientNotFoundError(command.id);
    }

    if (command.name !== undefined) {
      client.rename(command.name);
    }
    if (command.salary !== undefined) {
      client.updateSalary(command.salary);
    }
    if (command.companyValuation !== undefined) {
      client.updateCompanyValuation(command.companyValuation);
    }

    return this.clientRepository.save(client);
  }
}
