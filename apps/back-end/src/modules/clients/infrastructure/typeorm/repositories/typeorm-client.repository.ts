import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Client } from '../../../domain/entities/client.js';
import {
  ClientRepository,
  CreateClientInput,
  ListClientsOptions,
  ListClientsResult,
} from '../../../domain/interfaces/client.repository.js';
import { ClientPersistenceModel, ClientSchema } from '../schemas/client.schema.js';

@Injectable()
export class TypeOrmClientRepository extends ClientRepository {
  constructor(
    @InjectRepository(ClientSchema)
    private readonly repository: Repository<ClientPersistenceModel>,
  ) {
    super();
  }

  async create(input: CreateClientInput): Promise<Client> {
    const row = this.repository.create({
      name: input.name,
      salary: input.salary,
      companyValuation: input.companyValuation,
      accessCount: 0,
    });
    const saved = await this.repository.save(row);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Client | null> {
    const row = await this.repository.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async list(options: ListClientsOptions): Promise<ListClientsResult> {
    const [rows, total] = await this.repository.findAndCount({
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
      order: { createdAt: 'DESC', id: 'DESC' },
    });
    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
    };
  }

  async save(client: Client): Promise<Client> {
    const saved = await this.repository.save(this.toPersistence(client));
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }

  async findByName(name: string): Promise<Client[]> {
    const rows = await this.repository.find({
      where: { name: ILike(`%${name}%`) },
      order: { name: 'ASC' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: ClientPersistenceModel): Client {
    return new Client({
      id: row.id,
      name: row.name,
      salary: Number(row.salary),
      companyValuation: Number(row.companyValuation),
      accessCount: row.accessCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPersistence(client: Client): ClientPersistenceModel {
    return {
      id: client.id,
      name: client.name,
      salary: client.salary,
      companyValuation: client.companyValuation,
      accessCount: client.accessCount,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      deletedAt: null,
    };
  }
}
