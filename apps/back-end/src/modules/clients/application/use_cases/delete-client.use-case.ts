import { ClientNotFoundError } from '../../domain/errors/client-not-found.error.js';
import { ClientRepository } from '../../domain/interfaces/client.repository.js';

export class DeleteClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(id: string): Promise<void> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }
    await this.clientRepository.delete(id);
  }
}
