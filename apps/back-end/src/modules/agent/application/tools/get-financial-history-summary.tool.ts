import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { GetFinancialHistorySummaryUseCase } from '../../../clients/application/use_cases/get-financial-history-summary.use-case.js';

export function createGetFinancialHistorySummaryTool(
  useCase: GetFinancialHistorySummaryUseCase,
) {
  return new DynamicStructuredTool({
    name: 'get-financial-history-summary',
    description:
      'Get a summary of financial changes for all clients. Shows how many times each client had increases or decreases in salary or company valuation, and the total variation. Use this to answer questions like "who had the most salary increases" or "which company had the least increases".',
    schema: z.object({
      field: z
        .enum(['salary', 'companyValuation'])
        .optional()
        .describe('Filter by field type (optional, returns all if omitted)'),
    }),
    func: async ({ field }) => {
      const summary = await useCase.execute(field);
      if (summary.length === 0) {
        return 'No financial history data available.';
      }
      return JSON.stringify(summary);
    },
  });
}
