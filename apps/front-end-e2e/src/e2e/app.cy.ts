type ClientContract = {
  id: string;
  name: string;
  salary: number;
  companyValuation: number;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
};

describe('@teddy-open-finance/front-end-e2e', () => {
  const nowIso = '2026-04-13T12:00:00.000Z';
  let clients: ClientContract[] = [];

  const mockUser = {
    id: 'd6a703cb-213f-4282-8e2c-a59218a694f2',
    email: 'e2e@teddy.com',
    name: 'E2E User',
  };

  const mountApiMocks = () => {
    cy.intercept('POST', 'http://localhost:3000/auth/login', {
      statusCode: 200,
      body: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: mockUser,
      },
    }).as('login');

    cy.intercept('POST', 'http://localhost:3000/auth/refresh', {
      statusCode: 200,
      body: {
        accessToken: 'mock-access-token',
      },
    }).as('refresh');

    cy.intercept('GET', 'http://localhost:3000/clients*', (request) => {
      const page = Number(request.query.page ?? 1);
      const pageSize = Number(request.query.pageSize ?? 16);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const data = clients.slice(start, end);
      const total = clients.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      request.reply({
        statusCode: 200,
        body: {
          data,
          total,
          page,
          pageSize,
          totalPages,
        },
      });
    }).as('listClients');

    cy.intercept('POST', 'http://localhost:3000/clients', (request) => {
      const payload = request.body as {
        name: string;
        salary: number;
        companyValuation: number;
      };
      const createdClient: ClientContract = {
        id: crypto.randomUUID(),
        name: payload.name,
        salary: payload.salary,
        companyValuation: payload.companyValuation,
        accessCount: 0,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      clients = [createdClient, ...clients];
      request.reply({
        statusCode: 201,
        body: createdClient,
      });
    }).as('createClient');
  };

  beforeEach(() => {
    clients = Array.from({ length: 16 }, (_, index) => ({
      id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
      name: `Cliente ${index + 1}`,
      salary: 1500 + index * 100,
      companyValuation: 50000 + index * 1000,
      accessCount: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
    }));
    mountApiMocks();
  });

  it('logs in and renders clients list shell', () => {
    cy.login('e2e@teddy.com', '123456');
    cy.wait('@refresh');
    cy.wait('@listClients');
    cy.contains('clientes encontrados:').should('be.visible');
    cy.contains('Cliente 1').should('be.visible');
    cy.contains('Criar cliente').should('be.visible');
  });

  it('creates a client using BRL mask inputs', () => {
    cy.login('e2e@teddy.com', '123456');
    cy.wait('@refresh');
    cy.wait('@listClients');
    cy.get('button.clients-page__create-button:visible').first().click();

    cy.get('#client-name').type('Novo Cliente E2E');
    cy.get('#client-salary').type('123456');
    cy.get('#client-company-value').type('9876543');

    cy.get('#client-salary')
      .invoke('val')
      .should((inputValue) => expect(String(inputValue)).to.match(/^R\$\s?1\.234,56$/));
    cy.get('#client-company-value')
      .invoke('val')
      .should((inputValue) => expect(String(inputValue)).to.match(/^R\$\s?98\.765,43$/));

    cy.get('button.app-modal__submit').click();
    cy.wait('@createClient')
      .its('request.body')
      .should('deep.equal', {
        name: 'Novo Cliente E2E',
        salary: 1234.56,
        companyValuation: 98765.43,
      });

    cy.contains('Novo Cliente E2E').should('be.visible');
    cy.contains('17').should('be.visible');
  });
});
