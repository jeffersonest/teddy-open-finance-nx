import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { SearchClientsByNameUseCase } from '../../../clients/application/use_cases/search-clients-by-name.use-case.js';

export function createSearchClientsByNameTool(useCase: SearchClientsByNameUseCase) {
  return new DynamicStructuredTool({
    name: 'search-clients-by-name',
    description:
      'Search for clients by name. Returns matching clients with their salary, company valuation, and access count.',
    schema: z.object({
      name: z.string().describe('The name or partial name to search for'),
    }),
    func: async ({ name }) => {
      const clients = await useCase.execute(name);
      if (clients.length === 0) {
        return `No clients found matching "${name}".`;
      }
      return JSON.stringify(
        clients.map((client) => ({
          id: client.id,
          name: client.name,
          salary: client.salary,
          companyValuation: client.companyValuation,
          accessCount: client.accessCount,
        })),
      );
    },
  });
}
