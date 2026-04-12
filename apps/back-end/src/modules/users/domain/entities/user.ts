export interface UserProps {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  name: string;
  passwordHash: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  rename(name: string): void {
    this.name = name;
    this.touch();
  }

  changePassword(newHash: string): void {
    this.passwordHash = newHash;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
