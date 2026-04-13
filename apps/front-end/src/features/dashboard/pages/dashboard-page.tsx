import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useClients } from '../../clients/hooks/use-clients';
import { useSelectedClientsStore } from '../../../shared/stores/selected-clients-store';

const PAGE_SIZE = 16;

export function DashboardPage() {
  const [page, setPage] = useState(1);
  const { data: clientsPage, isLoading } = useClients(page, PAGE_SIZE);
  const selectedClients = useSelectedClientsStore((state) => state.clients);
  const addClientToSelection = useSelectedClientsStore((state) => state.addClient);
  const navigate = useNavigate();

  const clients = clientsPage?.data ?? [];
  const totalPages = clientsPage?.totalPages ?? 1;
  const selectedClientIds = new Set(selectedClients.map((selectedClient) => selectedClient.id));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-5">
      {isLoading ? (
        <div className="rounded-[4px] border border-black/5 bg-white px-6 py-8 text-sm text-slate-500 shadow-[0_0_8px_rgba(0,0,0,0.08)]">
          Carregando clientes...
        </div>
      ) : null}

      {!isLoading && clients.length === 0 ? (
        <div className="rounded-[4px] border border-black/5 bg-white px-6 py-8 text-sm text-slate-500 shadow-[0_0_8px_rgba(0,0,0,0.08)]">
          Nenhum cliente cadastrado.
        </div>
      ) : null}

      {!isLoading && clients.length > 0 ? (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {clients.map((client) => (
              <article
                key={client.id}
                className="flex min-h-[8.625rem] flex-col justify-between rounded-[4px] border border-black/5 bg-white px-4 py-5 text-center shadow-[0_0_8px_rgba(0,0,0,0.08)]"
              >
                <div>
                  <h2 className="text-[1.55rem] font-semibold leading-tight text-slate-950">
                    {client.name}
                  </h2>
                  <p className="mt-3 text-sm text-slate-500">
                    Salário: {formatCurrency(client.salary)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Empresa: {formatCurrency(client.companyValuation)}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const wasAdded = addClientToSelection(client);

                      if (!wasAdded) {
                        toast(`${client.name} já está selecionado`);
                        return;
                      }

                      toast.success(`${client.name} adicionado aos selecionados`);
                    }}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-[4px] border transition-colors ${
                      selectedClientIds.has(client.id)
                        ? 'border-sky-200 bg-sky-50 text-sky-600'
                        : 'border-transparent text-slate-700 hover:bg-slate-100'
                    }`}
                    aria-label={`Selecionar ${client.name}`}
                  >
                    <PlusIcon />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-transparent text-slate-700 transition-colors hover:bg-slate-100"
                    aria-label={`Abrir ${client.name}`}
                  >
                    <PencilIcon />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/clients')}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-transparent text-slate-700 transition-colors hover:bg-slate-100"
                    aria-label="Ir para clientes"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="flex min-h-[2.375rem] w-full items-center justify-center rounded-[4px] border-2 border-[#ec6724] bg-white px-4 text-sm font-semibold text-[#ec6724] transition-colors hover:bg-[#fff3ec]"
          >
            Criar cliente
          </button>

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              {buildPagination(page, totalPages).map((paginationItem, paginationIndex) => (
                <button
                  key={`${paginationItem}-${paginationIndex}`}
                  type="button"
                  onClick={() => {
                    if (typeof paginationItem !== 'number') {
                      return;
                    }

                    setPage(paginationItem);
                  }}
                  className={`inline-flex h-[2.188rem] min-w-[2.188rem] items-center justify-center rounded-[4px] px-3 text-sm font-semibold transition-colors ${
                    paginationItem === page
                      ? 'bg-[#ec6724] text-white'
                      : paginationItem === '...'
                        ? 'cursor-default text-slate-400'
                        : 'text-slate-700 hover:bg-white'
                  }`}
                  disabled={paginationItem === '...'}
                >
                  {paginationItem}
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function buildPagination(currentPage: number, totalPages: number): Array<number | '...'> {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

function PencilIcon() {
  return (
    <svg className="h-[1.125rem] w-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-[1.125rem] w-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-[1.125rem] w-[1.125rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
