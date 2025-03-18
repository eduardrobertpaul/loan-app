describe('Login Flow', () => {
  beforeEach(() => {
    // Reset any previous session state
    cy.visit('/api/auth/signout');
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should show validation errors for empty fields', () => {
    cy.visit('/login');
    
    // Try to submit the form without any input
    cy.findByRole('button', { name: /sign in/i }).click();
    
    // Check for validation messages
    cy.findByText(/email is required/i).should('be.visible');
    cy.findByText(/password is required/i).should('be.visible');
  });

  it('should show an error message for invalid credentials', () => {
    cy.visit('/login');
    
    // Enter invalid credentials
    cy.findByLabelText(/email/i).type('wrong@example.com');
    cy.findByLabelText(/password/i).type('wrongpassword');
    cy.findByRole('button', { name: /sign in/i }).click();
    
    // Check for error message
    cy.findByText(/invalid email or password/i).should('be.visible');
  });

  it('should successfully log in with valid credentials and redirect to dashboard', () => {
    cy.fixture('test-user').then((user) => {
      cy.visit('/login');
      
      // Enter valid credentials
      cy.findByLabelText(/email/i).type(user.email);
      cy.findByLabelText(/password/i).type(user.password);
      cy.findByRole('button', { name: /sign in/i }).click();
      
      // Check for successful redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.findByText(new RegExp(user.name, 'i')).should('be.visible');
    });
  });

  it('should redirect unauthenticated users to login page when accessing protected routes', () => {
    // Try to access a protected page
    cy.visit('/dashboard');
    
    // Should be redirected to login
    cy.url().should('include', '/login');
    cy.findByText(/sign in to your account/i).should('be.visible');
  });

  it('should allow logging out and redirect to login page', () => {
    cy.fixture('test-user').then((user) => {
      // Log in first
      cy.visit('/login');
      cy.findByLabelText(/email/i).type(user.email);
      cy.findByLabelText(/password/i).type(user.password);
      cy.findByRole('button', { name: /sign in/i }).click();
      
      // Verify we're logged in
      cy.url().should('include', '/dashboard');
      
      // Log out
      cy.findByRole('button', { name: /profile/i }).click();
      cy.findByRole('menuitem', { name: /sign out/i }).click();
      
      // Verify we're redirected to login
      cy.url().should('include', '/login');
    });
  });
}); 