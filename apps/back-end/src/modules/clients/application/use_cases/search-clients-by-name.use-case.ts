import { Client } from '../../domain/entities/client.js';
import { ClientRepository } from '../../domain/interfaces/client.repository.js';

export class SearchClientsByNameUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(name: string): Promise<Client[]> {
    return this.clientRepository.findByName(name);
  }
}
