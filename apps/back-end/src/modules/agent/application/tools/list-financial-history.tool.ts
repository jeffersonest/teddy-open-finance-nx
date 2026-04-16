import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { ListClientFinancialHistoryUseCase } from '../../../clients/application/use_cases/list-client-financial-history.use-case.js';

export function createListFinancialHistoryTool(
  useCase: ListClientFinancialHistoryUseCase,
) {
  return new DynamicStructuredTool({
    name: 'list-financial-history',
    description:
      'List the financial history of a specific client by their ID. Shows all salary and company valuation changes over time.',
    schema: z.object({
      clientId: z.string().uuid().describe('The UUID of the client'),
    }),
    func: async ({ clientId }) => {
      const entries = await useCase.execute(clientId);
      if (entries.length === 0) {
        return `No financial history found for client ${clientId}.`;
      }
      return JSON.stringify(
        entries.map((entry) => ({
          field: entry.field,
          previousValue: entry.previousValue,
          newValue: entry.newValue,
          changedAt: entry.changedAt.toISOString(),
        })),
      );
    },
  });
}
