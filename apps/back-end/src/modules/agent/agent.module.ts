import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import type { EnvironmentVariables } from '../../infrastructure/config/env/env.validation.js';
import { GetFinancialHistorySummaryUseCase } from '../clients/application/use_cases/get-financial-history-summary.use-case.js';
import { ListClientFinancialHistoryUseCase } from '../clients/application/use_cases/list-client-financial-history.use-case.js';
import { ListClientsUseCase } from '../clients/application/use_cases/list-clients.use-case.js';
import { SearchClientsByNameUseCase } from '../clients/application/use_cases/search-clients-by-name.use-case.js';
import { ClientsModule } from '../clients/clients.module.js';
import { AgentController } from './api/controllers/agent.controller.js';
import { createGetFinancialHistorySummaryTool } from './application/tools/get-financial-history-summary.tool.js';
import { createListClientsWithRankingTool } from './application/tools/list-clients-with-ranking.tool.js';
import { createListFinancialHistoryTool } from './application/tools/list-financial-history.tool.js';
import { createSearchClientsByNameTool } from './application/tools/search-clients-by-name.tool.js';
import { AgentRunner } from './domain/interfaces/agent-runner.js';
import { buildDatabaseUrl } from './infrastructure/config/database-url.js';
import { LangchainAgentRunner } from './infrastructure/langchain/langchain-agent-runner.js';

@Module({
  imports: [ClientsModule],
  controllers: [AgentController],
  providers: [
    {
      provide: AgentRunner,
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
        searchByName: SearchClientsByNameUseCase,
        listClients: ListClientsUseCase,
        listHistory: ListClientFinancialHistoryUseCase,
        historySummary: GetFinancialHistorySummaryUseCase,
        logger: PinoLogger,
      ) => {
        const apiKey = configService.get('OPENAI_API_KEY', { infer: true }) ?? '';
        const model = configService.get('OPENAI_MODEL', { infer: true });
        const databaseUrl = buildDatabaseUrl(configService);

        const tools = [
          createSearchClientsByNameTool(searchByName),
          createListClientsWithRankingTool(listClients),
          createListFinancialHistoryTool(listHistory),
          createGetFinancialHistorySummaryTool(historySummary),
        ];

        return new LangchainAgentRunner(apiKey, model, tools, databaseUrl, logger);
      },
      inject: [
        ConfigService,
        SearchClientsByNameUseCase,
        ListClientsUseCase,
        ListClientFinancialHistoryUseCase,
        GetFinancialHistorySummaryUseCase,
        PinoLogger,
      ],
    },
  ],
})
export class AgentModule {}
