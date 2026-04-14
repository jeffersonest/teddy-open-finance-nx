/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;
  }
}

Cypress.Commands.add('login', (email, password) => {
  void password;
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit('/clients', {
    onBeforeLoad(windowObject) {
      const browserWindow = windowObject as unknown as { localStorage: { setItem: (key: string, value: string) => void } };
      browserWindow.localStorage.setItem(
        'teddy-auth',
        JSON.stringify({
          state: {
            refreshToken: 'mock-refresh-token',
            user: {
              id: 'd6a703cb-213f-4282-8e2c-a59218a694f2',
              email,
              name: 'E2E User',
            },
          },
          version: 0,
        }),
      );
    },
  });
  cy.url().should('include', '/clients');
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
