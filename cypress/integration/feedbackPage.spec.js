
describe('Feedback Page', () => {
  it('should allow a user to submit feedback', () => {
    cy.visit('/login');

    // Simulate login
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();

    // Redirect to feedback page
    cy.url().should('include', '/feedback');

    // Submit feedback
    cy.get('textarea[aria-label="Enter your feedback"]').type('Amazing product!');
    cy.get('input[type="file"]').attachFile('example.png');
    cy.get('button[type="submit"]').click();
    
    // Verify feedback submission
    cy.contains('Feedback submitted successfully!');
  });
});
