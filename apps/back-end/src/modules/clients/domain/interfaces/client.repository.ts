import { Client } from '../entities/client.js';

export interface CreateClientInput {
  name: string;
  salary: number;
  companyValuation: number;
}

export interface ListClientsOptions {
  page: number;
  pageSize: number;
}

export interface ListClientsResult {
  data: Client[];
  total: number;
}

export abstract class ClientRepository {
  abstract create(input: CreateClientInput): Promise<Client>;
  abstract findById(id: string): Promise<Client | null>;
  abstract list(options: ListClientsOptions): Promise<ListClientsResult>;
  abstract save(client: Client): Promise<Client>;
  abstract delete(id: string): Promise<void>;
}
