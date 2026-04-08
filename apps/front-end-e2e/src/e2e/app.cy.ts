describe('@teddy-open-finance/front-end-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display the application title', () => {
    cy.get('h1').contains('Teddy Open Finance');
  });
});
