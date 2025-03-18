describe('Loan Application Submission', () => {
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

  it('should navigate to the new application form', () => {
    cy.visit('/dashboard/applications');
    cy.findByRole('link', { name: /new application/i }).click();
    
    cy.url().should('include', '/applications/new');
    cy.findByText(/personal information/i).should('be.visible');
  });

  it('should validate personal information and show validation errors', () => {
    cy.visit('/dashboard/applications/new');
    
    // Leave fields empty and try to proceed
    cy.findByRole('button', { name: /next/i }).click();
    
    // Check validation errors
    cy.findByText(/first name is required/i).should('be.visible');
    cy.findByText(/last name is required/i).should('be.visible');
    cy.findByText(/email is required/i).should('be.visible');
    cy.findByText(/phone is required/i).should('be.visible');
  });

  it('should allow completing the personal information step', () => {
    cy.fixture('test-application').then((application) => {
      cy.visit('/dashboard/applications/new');
      
      // Fill in personal information
      cy.findByLabelText(/first name/i).type(application.personalInfo.firstName);
      cy.findByLabelText(/last name/i).type(application.personalInfo.lastName);
      cy.findByLabelText(/email/i).type(application.personalInfo.email);
      cy.findByLabelText(/phone/i).type(application.personalInfo.phone);
      cy.findByLabelText(/date of birth/i).type(application.personalInfo.dateOfBirth);
      cy.findByLabelText(/address/i).type(application.personalInfo.address);
      cy.findByLabelText(/city/i).type(application.personalInfo.city);
      cy.findByLabelText(/state/i).type(application.personalInfo.state);
      cy.findByLabelText(/zip code/i).type(application.personalInfo.zipCode);
      
      // Proceed to next step
      cy.findByRole('button', { name: /next/i }).click();
      
      // Verify we're on the next step
      cy.findByText(/financial information/i).should('be.visible');
    });
  });

  it('should allow completing all steps and submitting an application', () => {
    cy.fixture('test-application').then((application) => {
      // Start a new application
      cy.visit('/dashboard/applications/new');
      
      // Step 1: Personal Information
      cy.findByLabelText(/first name/i).type(application.personalInfo.firstName);
      cy.findByLabelText(/last name/i).type(application.personalInfo.lastName);
      cy.findByLabelText(/email/i).type(application.personalInfo.email);
      cy.findByLabelText(/phone/i).type(application.personalInfo.phone);
      cy.findByLabelText(/date of birth/i).type(application.personalInfo.dateOfBirth);
      cy.findByLabelText(/address/i).type(application.personalInfo.address);
      cy.findByLabelText(/city/i).type(application.personalInfo.city);
      cy.findByLabelText(/state/i).type(application.personalInfo.state);
      cy.findByLabelText(/zip code/i).type(application.personalInfo.zipCode);
      cy.findByRole('button', { name: /next/i }).click();
      
      // Step 2: Financial Information
      cy.findByLabelText(/annual income/i).type(application.financialInfo.annualIncome.toString());
      cy.findByLabelText(/employment status/i).select(application.financialInfo.employmentStatus);
      cy.findByLabelText(/employer name/i).type(application.financialInfo.employerName);
      cy.findByLabelText(/job title/i).type(application.financialInfo.jobTitle);
      cy.findByLabelText(/years employed/i).type(application.financialInfo.yearsEmployed.toString());
      cy.findByLabelText(/monthly expenses/i).type(application.financialInfo.monthlyExpenses.toString());
      cy.findByLabelText(/other loans/i).type(application.financialInfo.otherLoans.toString());
      cy.findByLabelText(/credit score/i).type(application.financialInfo.creditScore.toString());
      if (application.financialInfo.bankruptcy) {
        cy.findByLabelText(/bankruptcy/i).check();
      }
      if (application.financialInfo.foreclosure) {
        cy.findByLabelText(/foreclosure/i).check();
      }
      cy.findByRole('button', { name: /next/i }).click();
      
      // Step 3: Loan Details
      cy.findByLabelText(/loan amount/i).type(application.loanDetails.loanAmount.toString());
      cy.findByLabelText(/loan purpose/i).select(application.loanDetails.loanPurpose);
      cy.findByLabelText(/loan term/i).type(application.loanDetails.loanTerm.toString());
      if (application.loanDetails.collateral) {
        cy.findByLabelText(/collateral/i).check();
        cy.findByLabelText(/collateral type/i).type(application.loanDetails.collateralType);
        cy.findByLabelText(/collateral value/i).type(application.loanDetails.collateralValue.toString());
      }
      cy.findByRole('button', { name: /next/i }).click();
      
      // Step 4: Review and Submit
      cy.findByText(/review your application/i).should('be.visible');
      
      // Verify application details are displayed correctly
      cy.findByText(application.personalInfo.firstName).should('be.visible');
      cy.findByText(application.personalInfo.lastName).should('be.visible');
      cy.findByText(application.personalInfo.email).should('be.visible');
      
      // Submit the application
      cy.findByRole('button', { name: /submit application/i }).click();
      
      // Verify successful submission
      cy.findByText(/application submitted successfully/i).should('be.visible');
      
      // Verify redirection to applications list
      cy.url().should('include', '/dashboard/applications');
    });
  });
}); 