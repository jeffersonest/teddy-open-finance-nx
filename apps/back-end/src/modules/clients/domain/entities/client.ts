export interface ClientProps {
  id: string;
  name: string;
  salary: number;
  companyValuation: number;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Client {
  readonly id: string;
  name: string;
  salary: number;
  companyValuation: number;
  accessCount: number;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: ClientProps) {
    this.id = props.id;
    this.name = props.name;
    this.salary = props.salary;
    this.companyValuation = props.companyValuation;
    this.accessCount = props.accessCount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  rename(name: string): void {
    this.name = name;
    this.touch();
  }

  updateSalary(salary: number): void {
    this.salary = salary;
    this.touch();
  }

  updateCompanyValuation(companyValuation: number): void {
    this.companyValuation = companyValuation;
    this.touch();
  }

  registerAccess(): void {
    this.accessCount += 1;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
