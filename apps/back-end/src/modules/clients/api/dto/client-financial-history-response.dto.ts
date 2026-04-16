import { ApiProperty } from '@nestjs/swagger';
import type { ClientFinancialHistoryItem } from '@teddy-open-finance/contracts';
import { ClientFinancialHistoryEntry } from '../../domain/entities/client-financial-history-entry.js';

export class ClientFinancialHistoryResponseDto implements ClientFinancialHistoryItem {
  @ApiProperty() id!: string;
  @ApiProperty() clientId!: string;
  @ApiProperty({ enum: ['salary', 'companyValuation'] }) field!: 'salary' | 'companyValuation';
  @ApiProperty() previousValue!: number;
  @ApiProperty() newValue!: number;
  @ApiProperty() changedAt!: string;

  static fromDomain(entry: ClientFinancialHistoryEntry): ClientFinancialHistoryResponseDto {
    const dto = new ClientFinancialHistoryResponseDto();
    dto.id = entry.id;
    dto.clientId = entry.clientId;
    dto.field = entry.field;
    dto.previousValue = entry.previousValue;
    dto.newValue = entry.newValue;
    dto.changedAt = entry.changedAt.toISOString();
    return dto;
  }
}
