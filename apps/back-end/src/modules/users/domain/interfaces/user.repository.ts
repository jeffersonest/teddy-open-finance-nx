import { User } from '../entities/user.js';

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
}

export abstract class UserRepository {
  abstract create(input: CreateUserInput): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
