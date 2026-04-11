import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@teddy-open-finance/contracts';
import { Client } from '../../domain/entities/client.js';
import { ClientRepository } from '../../domain/interfaces/client.repository.js';

export interface ListClientsQuery {
  page?: number;
  pageSize?: number;
}

export interface ListClientsResult {
  data: Client[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ListClientsUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(query: ListClientsQuery): Promise<ListClientsResult> {
    const page = query.page && query.page > 0 ? query.page : DEFAULT_PAGE;
    const pageSize = Math.min(
      query.pageSize && query.pageSize > 0 ? query.pageSize : DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    );

    const { data, total } = await this.clientRepository.list({ page, pageSize });

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: pageSize > 0 ? Math.ceil(total / pageSize) : 0,
    };
  }
}
