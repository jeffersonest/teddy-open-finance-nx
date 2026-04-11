import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.js';
import {
  CreateUserInput,
  UserRepository,
} from '../../../domain/interfaces/user.repository.js';
import { UserPersistenceModel, UserSchema } from '../schemas/user.schema.js';

@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserPersistenceModel>,
  ) {
    super();
  }

  async create(input: CreateUserInput): Promise<User> {
    const row = this.repository.create({
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
    });
    const saved = await this.repository.save(row);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.repository.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repository.findOne({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  private toDomain(row: UserPersistenceModel): User {
    return new User({
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
