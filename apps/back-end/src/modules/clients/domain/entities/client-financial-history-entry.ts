import type { ClientFinancialHistoryField } from '@teddy-open-finance/contracts';

export interface ClientFinancialHistoryEntryProps {
  id: string;
  clientId: string;
  field: ClientFinancialHistoryField;
  previousValue: number;
  newValue: number;
  changedAt: Date;
}

export class ClientFinancialHistoryEntry {
  readonly id: string;
  readonly clientId: string;
  readonly field: ClientFinancialHistoryField;
  readonly previousValue: number;
  readonly newValue: number;
  readonly changedAt: Date;

  constructor(props: ClientFinancialHistoryEntryProps) {
    this.id = props.id;
    this.clientId = props.clientId;
    this.field = props.field;
    this.previousValue = props.previousValue;
    this.newValue = props.newValue;
    this.changedAt = props.changedAt;
  }
}
