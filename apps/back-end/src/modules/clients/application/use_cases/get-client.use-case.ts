import { Client } from '../../domain/entities/client.js';
import { ClientNotFoundError } from '../../domain/errors/client-not-found.error.js';
import { ClientRepository } from '../../domain/interfaces/client.repository.js';

export class GetClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }
    return client;
  }
}
