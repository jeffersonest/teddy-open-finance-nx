import { DynamicStructuredTool } from '@langchain/core/tools';
import { MAX_PAGE_SIZE } from '@teddy-open-finance/contracts';
import { z } from 'zod';
import { ListClientsUseCase } from '../../../clients/application/use_cases/list-clients.use-case.js';
import { ListClientsWithRankingResult } from './types/list-clients-with-ranking-result.js';

export function createListClientsWithRankingTool(useCase: ListClientsUseCase) {
  return new DynamicStructuredTool({
    name: 'list-clients-with-ranking',
    description:
      'List all active clients with their salary and company valuation. The clients source is paginated, and this tool automatically traverses every page before answering. Use this to answer rankings, highest/lowest values, averages, totals, and comparisons over the full current dataset.',
    schema: z.object({
      sortBy: z
        .enum(['salary', 'companyValuation', 'name'])
        .optional()
        .describe('Field to sort by (optional, default: name)'),
    }),
    func: async ({ sortBy }) => {
      const { clients, total, pagesFetched } = await listAllClients(useCase);
      const rankedClients = clients.map((client) => ({
        id: client.id,
        name: client.name,
        salary: client.salary,
        companyValuation: client.companyValuation,
      }));

      if (sortBy === 'salary') {
        rankedClients.sort((leftClient, rightClient) => rightClient.salary - leftClient.salary);
      }

      if (sortBy === 'companyValuation') {
        rankedClients.sort(
          (leftClient, rightClient) =>
            rightClient.companyValuation - leftClient.companyValuation,
        );
      }

      const result: ListClientsWithRankingResult = {
        total,
        pageSizeUsed: MAX_PAGE_SIZE,
        pagesFetched,
        summary: {
          totalClients: total,
          averageSalary: calculateAverage(clients, (client) => client.salary),
          totalCompanyValuation: calculateSum(clients, (client) => client.companyValuation),
        },
        clients: rankedClients,
      };

      return JSON.stringify(result);
    },
  });
}

async function listAllClients(useCase: ListClientsUseCase) {
  const firstPage = await useCase.execute({ page: 1, pageSize: MAX_PAGE_SIZE });
  const clients = [...firstPage.data];

  if (firstPage.totalPages <= 1) {
    return {
      total: firstPage.total,
      pagesFetched: 1,
      clients,
    };
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, pageIndex) =>
      useCase.execute({ page: pageIndex + 2, pageSize: MAX_PAGE_SIZE }),
    ),
  );

  return {
    total: firstPage.total,
    pagesFetched: firstPage.totalPages,
    clients: [...clients, ...remainingPages.flatMap((clientsPage) => clientsPage.data)],
  };
}

function calculateAverage<TValue>(values: TValue[], getter: (value: TValue) => number) {
  if (values.length === 0) {
    return 0;
  }

  return calculateSum(values, getter) / values.length;
}

function calculateSum<TValue>(values: TValue[], getter: (value: TValue) => number) {
  return values.reduce((totalValue, value) => totalValue + getter(value), 0);
}
