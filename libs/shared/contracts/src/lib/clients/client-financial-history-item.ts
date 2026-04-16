export type ClientFinancialHistoryField = 'salary' | 'companyValuation';

export interface ClientFinancialHistoryItem {
  id: string;
  clientId: string;
  field: ClientFinancialHistoryField;
  previousValue: number;
  newValue: number;
  changedAt: string;
}
