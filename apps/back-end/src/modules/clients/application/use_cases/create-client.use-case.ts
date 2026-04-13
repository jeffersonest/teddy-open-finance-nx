import { Client } from '../../domain/entities/client.js';
import { ClientRepository } from '../../domain/interfaces/client.repository.js';

export interface CreateClientCommand {
  name: string;
  salary: number;
  companyValuation: number;
}

export class CreateClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(command: CreateClientCommand): Promise<Client> {
    return this.clientRepository.create({
      name: command.name,
      salary: command.salary,
      companyValuation: command.companyValuation,
    });
  }
}
