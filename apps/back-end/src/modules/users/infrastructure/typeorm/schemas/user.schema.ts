import { EntitySchema } from 'typeorm';

export interface UserPersistenceModel {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new EntitySchema<UserPersistenceModel>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
    },
    name: {
      type: 'varchar',
      length: 255,
    },
    passwordHash: {
      name: 'password_hash',
      type: 'varchar',
      length: 255,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamptz',
      updateDate: true,
    },
  },
  indices: [
    {
      name: 'idx_users_email',
      columns: ['email'],
      unique: true,
    },
  ],
});
