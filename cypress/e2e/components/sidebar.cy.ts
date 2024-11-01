// cypress/e2e/components/sidebar.cy.ts
/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Sidebar Component', () => {
  beforeEach(() => {
    cy.visit('/');

    // Check for dashboard element
    cy.get('body').then($body => {
      if ($body.find('[data-testid="dashboard"]').length === 0) {
        cy.login();
      }
    });
  });

  it('should display the sidebar', () => {
    cy.get('[data-testid="sidebar"]').should('exist');
  });

  it('should toggle sidebar visibility', () => {
    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="sidebar"]').should('not.be.visible');
    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="sidebar"]').should('be.visible');
  });
});
