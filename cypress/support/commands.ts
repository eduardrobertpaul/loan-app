/// <reference types="cypress" />
// ***********************************************
// Custom commands for the loan application system
// ***********************************************

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole('button', { name: /sign in/i }).click();
  
  // Wait for redirect to dashboard after successful login
  cy.url().should('include', '/dashboard');
});

// Create a new application command
Cypress.Commands.add('startNewApplication', () => {
  // Navigate to applications page
  cy.visit('/dashboard/applications');
  
  // Click the new application button
  cy.findByRole('link', { name: /new application/i }).click();
  
  // Verify we're on the new application page
  cy.url().should('include', '/applications/new');
});

// Fill personal information step
Cypress.Commands.add('fillPersonalInformation', (personalInfo: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}) => {
  cy.findByLabelText(/first name/i).clear().type(personalInfo.firstName);
  cy.findByLabelText(/last name/i).clear().type(personalInfo.lastName);
  cy.findByLabelText(/email/i).clear().type(personalInfo.email);
  cy.findByLabelText(/phone/i).clear().type(personalInfo.phone);
  cy.findByLabelText(/date of birth/i).clear().type(personalInfo.dateOfBirth);
  cy.findByLabelText(/address/i).clear().type(personalInfo.address);
  cy.findByLabelText(/city/i).clear().type(personalInfo.city);
  cy.findByLabelText(/state/i).clear().type(personalInfo.state);
  cy.findByLabelText(/zip code/i).clear().type(personalInfo.zipCode);
  
  // Click next to proceed to next step
  cy.findByRole('button', { name: /next/i }).click();
});

// Fill financial information step
Cypress.Commands.add('fillFinancialInformation', (financialInfo: {
  annualIncome: number;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
  employerName?: string;
  jobTitle?: string;
  yearsEmployed?: number;
  monthlyExpenses: number;
  otherLoans: number;
  creditScore: number;
  bankruptcy: boolean;
  foreclosure: boolean;
}) => {
  cy.findByLabelText(/annual income/i).clear().type(financialInfo.annualIncome.toString());
  cy.findByLabelText(/employment status/i).select(financialInfo.employmentStatus);
  
  if (financialInfo.employmentStatus === 'employed' || financialInfo.employmentStatus === 'self-employed') {
    cy.findByLabelText(/employer name/i).clear().type(financialInfo.employerName || '');
    cy.findByLabelText(/job title/i).clear().type(financialInfo.jobTitle || '');
    cy.findByLabelText(/years employed/i).clear().type((financialInfo.yearsEmployed || 0).toString());
  }
  
  cy.findByLabelText(/monthly expenses/i).clear().type(financialInfo.monthlyExpenses.toString());
  cy.findByLabelText(/other loans/i).clear().type(financialInfo.otherLoans.toString());
  cy.findByLabelText(/credit score/i).clear().type(financialInfo.creditScore.toString());
  
  if (financialInfo.bankruptcy) {
    cy.findByLabelText(/bankruptcy/i).check();
  } else {
    cy.findByLabelText(/bankruptcy/i).uncheck();
  }
  
  if (financialInfo.foreclosure) {
    cy.findByLabelText(/foreclosure/i).check();
  } else {
    cy.findByLabelText(/foreclosure/i).uncheck();
  }
  
  // Click next to proceed to next step
  cy.findByRole('button', { name: /next/i }).click();
});

// Fill loan details step
Cypress.Commands.add('fillLoanDetails', (loanDetails: {
  loanAmount: number;
  loanPurpose: 'home' | 'auto' | 'education' | 'personal' | 'business' | 'debt_consolidation' | 'other';
  otherPurposeDescription?: string;
  loanTerm: number;
  collateral: boolean;
  collateralType?: string;
  collateralValue?: number;
}) => {
  cy.findByLabelText(/loan amount/i).clear().type(loanDetails.loanAmount.toString());
  cy.findByLabelText(/loan purpose/i).select(loanDetails.loanPurpose);
  
  if (loanDetails.loanPurpose === 'other') {
    cy.findByLabelText(/purpose description/i).clear().type(loanDetails.otherPurposeDescription || '');
  }
  
  cy.findByLabelText(/loan term/i).clear().type(loanDetails.loanTerm.toString());
  
  if (loanDetails.collateral) {
    cy.findByLabelText(/collateral/i).check();
    cy.findByLabelText(/collateral type/i).clear().type(loanDetails.collateralType || '');
    cy.findByLabelText(/collateral value/i).clear().type((loanDetails.collateralValue || 0).toString());
  } else {
    cy.findByLabelText(/collateral/i).uncheck();
  }
  
  // Click next to proceed to next step
  cy.findByRole('button', { name: /next/i }).click();
});

// Submit the application
Cypress.Commands.add('submitApplication', () => {
  // On the review page, submit the application
  cy.findByRole('button', { name: /submit application/i }).click();
  
  // Verify submission was successful
  cy.contains(/application submitted successfully/i).should('be.visible');
});

// Type declarations for Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      startNewApplication(): Chainable<void>
      fillPersonalInformation(personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
      }): Chainable<void>
      fillFinancialInformation(financialInfo: {
        annualIncome: number;
        employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
        employerName?: string;
        jobTitle?: string;
        yearsEmployed?: number;
        monthlyExpenses: number;
        otherLoans: number;
        creditScore: number;
        bankruptcy: boolean;
        foreclosure: boolean;
      }): Chainable<void>
      fillLoanDetails(loanDetails: {
        loanAmount: number;
        loanPurpose: 'home' | 'auto' | 'education' | 'personal' | 'business' | 'debt_consolidation' | 'other';
        otherPurposeDescription?: string;
        loanTerm: number;
        collateral: boolean;
        collateralType?: string;
        collateralValue?: number;
      }): Chainable<void>
      submitApplication(): Chainable<void>
    }
  }
} 