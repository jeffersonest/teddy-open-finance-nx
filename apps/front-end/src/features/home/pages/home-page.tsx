import type { Client } from '@teddy-open-finance/contracts';
import { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  formatCompactCurrency,
  formatLongDate,
  formatRoundedCurrency,
  formatShortDate,
} from '../../../shared/lib/formatters';
import { useDashboardClients } from '../../clients/hooks/use-clients';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';

export function HomePage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useDashboardClients();
  const selectedClients = useSelectedClientsStore((state) => state.clients);

  const clients = data?.clients ?? [];
  const latestClients = clients.slice(0, 5);
  const topSalaryClients = getTopClients(clients, (client) => client.salary);
  const topAccessClients = getTopClients(clients, (client) => client.accessCount);
  const topValuationClients = getTopClients(clients, (client) => client.companyValuation);
  const totalClients = data?.total ?? 0;
  const selectedClientsCount = selectedClients.length;
  const averageSalary = calculateAverage(clients, (client) => client.salary);
  const totalValuation = calculateSum(clients, (client) => client.companyValuation);
  const openClientDetail = (clientId: string) => navigate(`/clients/${clientId}`);
  const handleLatestClientKeyDown = (event: KeyboardEvent<HTMLElement>, clientId: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    openClientDetail(clientId);
  };

  return (
    <section className="home-page">
      <header className="home-page__header">
        <div>
          <p className="home-page__eyebrow">Dashboard</p>
          <h1 className="home-page__title">Visão geral da operação de clientes</h1>
        </div>
      </header>

      <div className="dashboard-metrics">
        <article className="dashboard-metric-card">
          <span className="dashboard-metric-card__label">Clientes cadastrados</span>
          <strong className="dashboard-metric-card__value">
            {isLoading ? '...' : String(totalClients)}
          </strong>
          <span className="dashboard-metric-card__hint">Base disponível para o dashboard</span>
        </article>

        <article className="dashboard-metric-card">
          <span className="dashboard-metric-card__label">Clientes selecionados</span>
          <strong className="dashboard-metric-card__value">{String(selectedClientsCount)}</strong>
          <span className="dashboard-metric-card__hint">Itens marcados para acompanhamento</span>
        </article>

        <article className="dashboard-metric-card">
          <span className="dashboard-metric-card__label">Salário médio</span>
          <strong className="dashboard-metric-card__value">
            {isLoading ? '...' : formatRoundedCurrency(averageSalary)}
          </strong>
          <span className="dashboard-metric-card__hint">
            Calculado com {clients.length || totalClients} clientes carregados
          </span>
        </article>

        <article className="dashboard-metric-card">
          <span className="dashboard-metric-card__label">Receita potencial total</span>
          <strong className="dashboard-metric-card__value">
            {isLoading ? '...' : formatCompactCurrency(totalValuation)}
          </strong>
          <span className="dashboard-metric-card__hint">Somatório do valuation carregado</span>
        </article>
      </div>

      <div className="dashboard-panels-grid">
        <TopClientsChart
          title="Top 5 maiores salários"
          metricLabel="Salário"
          clients={topSalaryClients}
          isLoading={isLoading}
          isError={isError}
          getValue={(client) => client.salary}
          formatValue={formatRoundedCurrency}
        />

        <TopClientsChart
          title="Top 5 mais acessos"
          metricLabel="Acessos"
          clients={topAccessClients}
          isLoading={isLoading}
          isError={isError}
          getValue={(client) => client.accessCount}
          formatValue={(value) => String(value)}
        />

        <TopClientsChart
          title="Top 5 maior receita na empresa"
          metricLabel="Receita"
          clients={topValuationClients}
          isLoading={isLoading}
          isError={isError}
          getValue={(client) => client.companyValuation}
          formatValue={formatRoundedCurrency}
        />

        <aside className="dashboard-panel dashboard-panel--latest">
          <header className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Últimos clientes</p>
              <h2 className="dashboard-panel__title">Entradas mais recentes</h2>
            </div>
          </header>

          {isError ? (
            <p className="dashboard-panel__empty">
              Não foi possível carregar a lista de clientes recentes.
            </p>
          ) : null}

          {!isError && !isLoading && latestClients.length === 0 ? (
            <p className="dashboard-panel__empty">Nenhum cliente cadastrado ainda.</p>
          ) : null}

          {!isError && (isLoading || latestClients.length > 0) ? (
            <div className="dashboard-latest-list">
              {(isLoading ? createLoadingLatestClients() : latestClients).map((client) => (
                <article
                  className={`dashboard-latest-card ${isLoading ? '' : 'dashboard-latest-card--interactive'}`}
                  key={client.id}
                  onClick={isLoading ? undefined : () => openClientDetail(client.id)}
                  onKeyDown={
                    isLoading
                      ? undefined
                      : (event) => handleLatestClientKeyDown(event, client.id)
                  }
                  tabIndex={isLoading ? -1 : 0}
                  role={isLoading ? undefined : 'button'}
                  aria-label={isLoading ? undefined : `Abrir detalhes de ${client.name}`}
                >
                  <div className="dashboard-latest-card__top">
                    <div>
                      <h3 className="dashboard-latest-card__name">{client.name}</h3>
                      <p className="dashboard-latest-card__date">
                        {isLoading ? '...' : formatLongDate(client.createdAt)}
                      </p>
                    </div>
                    <span className="dashboard-latest-card__badge">
                      {isLoading ? '...' : `${client.accessCount} acessos`}
                    </span>
                  </div>
                  <dl className="dashboard-latest-card__details">
                    <div>
                      <dt>Salário</dt>
                      <dd>{isLoading ? '...' : formatRoundedCurrency(client.salary)}</dd>
                    </div>
                    <div>
                      <dt>Receita</dt>
                      <dd>{isLoading ? '...' : formatRoundedCurrency(client.companyValuation)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function TopClientsChart({
  title,
  metricLabel,
  clients,
  isLoading,
  isError,
  getValue,
  formatValue,
}: {
  title: string;
  metricLabel: string;
  clients: Client[];
  isLoading: boolean;
  isError: boolean;
  getValue: (client: Client) => number;
  formatValue: (value: number) => string;
}) {
  const chartClients = isLoading ? createLoadingChartBars() : clients;
  const chartMaxValue = Math.max(...chartClients.map((client) => getValue(client)), 1);

  return (
    <article className="dashboard-panel dashboard-panel--chart">
      <header className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow">{metricLabel}</p>
          <h2 className="dashboard-panel__title">{title}</h2>
        </div>
      </header>

      {isError ? (
        <p className="dashboard-panel__empty">Não foi possível carregar este gráfico.</p>
      ) : null}

      {!isError && !isLoading && clients.length === 0 ? (
        <p className="dashboard-panel__empty">Ainda não há clientes suficientes para este ranking.</p>
      ) : null}

      {!isError && (isLoading || clients.length > 0) ? (
        <div className="dashboard-chart dashboard-chart--compact">
          <div className="dashboard-chart__bars dashboard-chart__bars--top-five">
            {chartClients.map((client, chartIndex) => {
              const currentValue = getValue(client);
              const barHeight = isLoading
                ? createLoadingChartHeight(chartIndex)
                : Math.max((currentValue / chartMaxValue) * 100, 14);

              return (
                <article className="dashboard-chart__bar-card" key={client.id}>
                  <strong className="dashboard-chart__amount">
                    {isLoading ? '...' : formatValue(currentValue)}
                  </strong>
                  <div className="dashboard-chart__track">
                    <div
                      className="dashboard-chart__bar"
                      style={{ height: `${barHeight}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="dashboard-chart__label">
                    {isLoading ? '...' : getShortName(client.name)}
                  </span>
                  <span className="dashboard-chart__meta">
                    {isLoading ? '...' : formatShortDate(client.createdAt)}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function getTopClients(clients: Client[], getter: (client: Client) => number) {
  return [...clients].sort((leftClient, rightClient) => getter(rightClient) - getter(leftClient)).slice(0, 5);
}

function calculateAverage(clients: Client[], getter: (client: Client) => number) {
  if (clients.length === 0) {
    return 0;
  }

  return calculateSum(clients, getter) / clients.length;
}

function calculateSum(clients: Client[], getter: (client: Client) => number) {
  return clients.reduce((totalValue, client) => totalValue + getter(client), 0);
}

function getShortName(name: string) {
  const [firstName = 'Cliente', secondName] = name.split(' ');
  return secondName ? `${firstName} ${secondName.slice(0, 1)}.` : firstName;
}

function createLoadingChartBars(): Client[] {
  return Array.from({ length: 5 }, (_, barIndex) => ({
    id: `loading-chart-${barIndex}`,
    name: 'Carregando',
    salary: chartLoadingPattern[barIndex] ?? 1,
    companyValuation: chartLoadingPattern[barIndex] ?? 1,
    accessCount: chartLoadingPattern[barIndex] ?? 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function createLoadingLatestClients(): Client[] {
  return Array.from({ length: 5 }, (_, clientIndex) => ({
    id: `loading-client-${clientIndex}`,
    name: 'Carregando cliente',
    salary: 0,
    companyValuation: 0,
    accessCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function createLoadingChartHeight(chartIndex: number) {
  return chartLoadingPattern[chartIndex] ?? 50;
}

const chartLoadingPattern = [52, 76, 44, 88, 61];
