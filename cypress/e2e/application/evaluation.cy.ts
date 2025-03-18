describe('Loan Application Evaluation', () => {
  beforeEach(() => {
    cy.fixture('test-user').then((user) => {
      // Log in first
      cy.visit('/login');
      cy.findByLabelText(/email/i).type(user.email);
      cy.findByLabelText(/password/i).type(user.password);
      cy.findByRole('button', { name: /sign in/i }).click();
      
      // Verify we're logged in
      cy.url().should('include', '/dashboard');
    });
  });

  it('should navigate to an application detail page', () => {
    // Assuming there's at least one application in the list
    cy.visit('/dashboard/applications');
    
    // Click on the first application in the list
    cy.get('table tbody tr').first().find('a').contains(/view/i).click();
    
    // Verify we're on the application detail page
    cy.url().should('include', '/applications/');
    cy.findByText(/application details/i).should('be.visible');
  });

  it('should display application details correctly', () => {
    // Assuming we have an application with ID 'test-app-1'
    cy.visit('/dashboard/applications/test-app-1');
    
    // Check that application sections are present
    cy.findByText(/personal information/i).should('be.visible');
    cy.findByText(/financial information/i).should('be.visible');
    cy.findByText(/loan details/i).should('be.visible');
    
    // Check some specific application details
    cy.findByText(/credit score/i).should('be.visible');
    cy.findByText(/loan amount/i).should('be.visible');
  });

  it('should allow bank staff to evaluate an application', () => {
    // Assuming we have a pending application with ID 'test-app-pending'
    cy.visit('/dashboard/applications/test-app-pending');
    
    // Check that the status is pending
    cy.findByText(/status: pending/i).should('be.visible');
    
    // Find and click the evaluate button
    cy.findByRole('button', { name: /evaluate/i }).click();
    
    // Wait for evaluation to complete
    cy.findByText(/evaluation complete/i).should('be.visible');
    
    // Verify evaluation results are displayed
    cy.findByText(/evaluation score/i).should('be.visible');
    cy.findByText(/application (approved|rejected)/i).should('be.visible');
    
    // Check that evaluation factors are shown
    cy.findByText(/credit score assessment/i).should('be.visible');
    cy.findByText(/income to loan ratio/i).should('be.visible');
  });

  it('should allow adding notes to an application', () => {
    // Assuming we have an application with ID 'test-app-1'
    cy.visit('/dashboard/applications/test-app-1');
    
    // Add a note
    const testNote = 'This is a test note for the application';
    cy.findByLabelText(/add note/i).type(testNote);
    cy.findByRole('button', { name: /add note/i }).click();
    
    // Verify note was added
    cy.findByText(testNote).should('be.visible');
  });

  it('should show approved status for approved applications', () => {
    // Assuming we have an approved application with ID 'test-app-approved'
    cy.visit('/dashboard/applications/test-app-approved');
    
    // Check that the status is approved
    cy.findByText(/status: approved/i).should('be.visible');
    
    // Check that approval details are shown
    cy.findByText(/approved on/i).should('be.visible');
    cy.findByText(/approval score/i).should('be.visible');
  });

  it('should show rejected status for rejected applications', () => {
    // Assuming we have a rejected application with ID 'test-app-rejected'
    cy.visit('/dashboard/applications/test-app-rejected');
    
    // Check that the status is rejected
    cy.findByText(/status: rejected/i).should('be.visible');
    
    // Check that rejection details are shown
    cy.findByText(/rejected on/i).should('be.visible');
    cy.findByText(/rejection reason/i).should('be.visible');
  });
}); 