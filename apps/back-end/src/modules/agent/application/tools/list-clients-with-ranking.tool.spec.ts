import { Client } from '../../../clients/domain/entities/client.js';
import { createListClientsWithRankingTool } from './list-clients-with-ranking.tool.js';
import { ListClientsWithRankingResult } from './types/list-clients-with-ranking-result.js';

describe('createListClientsWithRankingTool', () => {
  it('fetches every paginated page before returning ranking data', async () => {
    const execute = jest
      .fn()
      .mockResolvedValueOnce({
        data: [
          createClient({
            id: 'client-1',
            name: 'Cliente 1',
            salary: 5000,
            companyValuation: 100000,
          }),
          createClient({
            id: 'client-2',
            name: 'Cliente 2',
            salary: 6500,
            companyValuation: 120000,
          }),
        ],
        total: 3,
        page: 1,
        pageSize: 2,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        data: [
          createClient({
            id: 'client-3',
            name: 'Cliente 3',
            salary: 7200,
            companyValuation: 150000,
          }),
        ],
        total: 3,
        page: 2,
        pageSize: 2,
        totalPages: 2,
      });

    const tool = createListClientsWithRankingTool({
      execute,
    } as never);

    const payload = await tool.func({ sortBy: 'salary' });

    if (typeof payload !== 'string') {
      throw new Error('Expected tool payload to be a string.');
    }

    const result = JSON.parse(payload) as ListClientsWithRankingResult;

    expect(execute).toHaveBeenNthCalledWith(1, { page: 1, pageSize: 100 });
    expect(execute).toHaveBeenNthCalledWith(2, { page: 2, pageSize: 100 });
    expect(result.total).toBe(3);
    expect(result.pagesFetched).toBe(2);
    expect(result.summary.totalClients).toBe(3);
    expect(result.summary.averageSalary).toBe(6233.333333333333);
    expect(result.summary.totalCompanyValuation).toBe(370000);
    expect(result.clients.map((client) => client.id)).toEqual([
      'client-3',
      'client-2',
      'client-1',
    ]);
  });
});

function createClient({
  id,
  name,
  salary,
  companyValuation,
}: {
  id: string;
  name: string;
  salary: number;
  companyValuation: number;
}) {
  const timestamp = new Date('2026-04-16T00:00:00.000Z');

  return new Client({
    id,
    name,
    salary,
    companyValuation,
    accessCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}
