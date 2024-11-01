// cypress/support/commands.ts

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import './index.d.ts';
/**
 * Login command implementation
 * Navigates to login page and performs login with predefined credentials
 */
Cypress.Commands.add('login', () => {
  // Navigate to login page
  cy.visit('/auth/login');

  // Fill in login form
  cy.get('[data-testid="email-input"]').type(Cypress.env('USER_EMAIL') || 'test@example.com');
  cy.get('[data-testid="password-input"]').type(Cypress.env('USER_PASSWORD') || 'password123');

  // Submit form
  cy.get('[data-testid="login-submit"]').click();

  // Wait for successful login
  cy.get('[data-testid="dashboard"]', { timeout: 10000 }).should('exist');
});

export { };
