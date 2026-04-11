import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateClientUseCase } from './application/use_cases/create-client.use-case.js';
import { DeleteClientUseCase } from './application/use_cases/delete-client.use-case.js';
import { GetClientUseCase } from './application/use_cases/get-client.use-case.js';
import { ListClientsUseCase } from './application/use_cases/list-clients.use-case.js';
import { UpdateClientUseCase } from './application/use_cases/update-client.use-case.js';
import { ClientRepository } from './domain/interfaces/client.repository.js';
import { ClientsController } from './api/controllers/clients.controller.js';
import { ClientSchema } from './infrastructure/typeorm/schemas/client.schema.js';
import { TypeOrmClientRepository } from './infrastructure/typeorm/repositories/typeorm-client.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([ClientSchema])],
  controllers: [ClientsController],
  providers: [
    {
      provide: ClientRepository,
      useClass: TypeOrmClientRepository,
    },
    {
      provide: CreateClientUseCase,
      useFactory: (repo: ClientRepository) => new CreateClientUseCase(repo),
      inject: [ClientRepository],
    },
    {
      provide: ListClientsUseCase,
      useFactory: (repo: ClientRepository) => new ListClientsUseCase(repo),
      inject: [ClientRepository],
    },
    {
      provide: GetClientUseCase,
      useFactory: (repo: ClientRepository) => new GetClientUseCase(repo),
      inject: [ClientRepository],
    },
    {
      provide: UpdateClientUseCase,
      useFactory: (repo: ClientRepository) => new UpdateClientUseCase(repo),
      inject: [ClientRepository],
    },
    {
      provide: DeleteClientUseCase,
      useFactory: (repo: ClientRepository) => new DeleteClientUseCase(repo),
      inject: [ClientRepository],
    },
  ],
})
export class ClientsModule {}
