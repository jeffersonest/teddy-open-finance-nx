import { ApiProperty } from '@nestjs/swagger';
import type { Client as ClientContract, Paginated } from '@teddy-open-finance/contracts';
import { Client } from '../../domain/entities/client.js';

export class ClientResponseDto implements ClientContract {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() salary!: number;
  @ApiProperty() companyValuation!: number;
  @ApiProperty() accessCount!: number;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;

  static fromDomain(client: Client): ClientResponseDto {
    const dto = new ClientResponseDto();
    dto.id = client.id;
    dto.name = client.name;
    dto.salary = client.salary;
    dto.companyValuation = client.companyValuation;
    dto.accessCount = client.accessCount;
    dto.createdAt = client.createdAt.toISOString();
    dto.updatedAt = client.updatedAt.toISOString();
    return dto;
  }
}

export class PaginatedClientsResponseDto implements Paginated<ClientContract> {
  @ApiProperty({ type: [ClientResponseDto] }) data!: ClientResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() pageSize!: number;
  @ApiProperty() totalPages!: number;
}
