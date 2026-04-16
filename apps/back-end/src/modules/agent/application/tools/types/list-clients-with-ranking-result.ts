export interface ListClientsWithRankingClient {
  id: string;
  name: string;
  salary: number;
  companyValuation: number;
}

export interface ListClientsWithRankingSummary {
  totalClients: number;
  averageSalary: number;
  totalCompanyValuation: number;
}

export interface ListClientsWithRankingResult {
  total: number;
  pageSizeUsed: number;
  pagesFetched: number;
  summary: ListClientsWithRankingSummary;
  clients: ListClientsWithRankingClient[];
}
