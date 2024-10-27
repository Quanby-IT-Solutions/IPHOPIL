describe('welcome to login', () => {
  it("login", () => {
    cy.visit('http://localhost:4200/');
    cy.contains('Sign in as Admin').click();
    cy.url().should("include", "/admin/dashboard");
  })

  // it.only("logout", () => {
  //   cy.visit("http://localhost:4200/admin/dashboard");
  //   cy.contains('Sign Out').click();
  //   cy.url().should("include", "/login");
  // })
})

