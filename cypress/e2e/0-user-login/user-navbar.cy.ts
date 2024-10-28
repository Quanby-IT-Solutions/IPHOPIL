describe('User Login', () => {
  beforeEach(() => {
    // Check if already logged in by looking for a dashboard element
    cy.visit('http://localhost:4200/');
    cy.get('body').then((body) => {
      if (body.find('[data-testid="dashboard-element"]').length === 0) {
        cy.contains('Sign in as User').click();
        cy.url().should("include", "/user/dashboard");
      }
    });
  });

  it("Navbar Links", () => {
    // Array of navigation links to verify
    const navLinks = ['DOCUMENTS', 'INCOMING', 'RECEIVED', 'OUTGOING', 'COMPLETED', 'REPORTS', 'DOCUMENTS'];

    // Loop through each link and verify its presence and functionality
    navLinks.forEach(linkText => {
      cy.contains(linkText).click();
    });
  });

  it("Documents Check [Headings and Rows]", () => {
    // Navigate to the Documents section
    cy.contains('DOCUMENTS').click();
    cy.url().should("include", "/user/documents");

    // Expected headings for document table
    const expectedHeadings = [
      'PRINT', 'CODE', 'SUBJECT/TITLE', 'CATEGORY',
      'TYPE', 'CREATED BY', 'DATE CREATED',
      'ORIGIN OFFICE', 'ACTIONS'
    ];

    // Verify each table heading in order, case-insensitively
    cy.get('table thead tr th').each((header, index) => {
      expect(header.text().trim().toUpperCase()).to.equal(expectedHeadings[index].toUpperCase());
    });

    // Ensure table contains at least one row in the tbody
    cy.get('table tbody tr').should('exist').and('have.length.greaterThan', 0);
  });

  it("Search in Documents", () => {
    // Navigate to the Documents section
    cy.contains('DOCUMENTS').click();
    cy.url().should("include", "/user/documents");

    // Search term
    const searchCode = 'AB1234CD';

    // Wait for the search input to be visible and functional before typing
    cy.get('input[placeholder*="Search"]', { timeout: 10000 })
      .should('be.visible')
      .focus()
      .clear()
      .type(searchCode, { delay: 100 });

    // Check if "No documents found" message appears after typing
    cy.get('body').then((body) => {
      if (body.find('[data-testid="no-documents-message"]').length > 0) {
        cy.log('No documents found for search term:', searchCode);
        cy.get('[data-testid="no-documents-message"]').should('be.visible');
      } else {
        // Verify at least one row in the table if documents are found
        cy.get('table tbody tr').should('exist').and('have.length.greaterThan', 0);
      }
    });
  });
});
