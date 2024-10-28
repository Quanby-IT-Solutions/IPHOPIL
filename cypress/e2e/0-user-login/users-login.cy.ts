describe('welcome to login', () => {
  it("login admin", () => {
    cy.visit('http://localhost:4200/');
    cy.contains('Sign in as Admin').click();
    // add handler if credentials are error
    cy.url().should("include", "/admin/dashboard");
    cy.wait(5000);
    cy.contains('Sign Out').click();
    cy.url().should("include", "/login");
  })

  it("login user", () => {
    cy.visit('http://localhost:4200/');
    cy.contains('Sign in as User').click();
    // add handler if credentials are error
    cy.url().should("include", "/user/dashboard");
    cy.wait(5000);
    cy.contains('Sign Out').click();
    cy.url().should("include", "/login");
  })
})

