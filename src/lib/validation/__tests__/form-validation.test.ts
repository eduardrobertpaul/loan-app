import { z } from 'zod';
import {
  personalInfoSchema,
  financialInfoSchema,
  loanDetailsSchema,
  validatePersonalInfo,
  validateFinancialInfo,
  validateLoanDetails
} from '../form-validation';
import '@testing-library/jest-dom';

describe('Form Validation - Personal Info', () => {
  test('should validate valid personal info', () => {
    const validPersonalInfo = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    };
    
    const result = validatePersonalInfo(validPersonalInfo);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPersonalInfo);
    }
  });
  
  test('should reject personal info with missing required fields', () => {
    const invalidPersonalInfo = {
      firstName: '',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    };
    
    const result = validatePersonalInfo(invalidPersonalInfo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('firstName'))).toBe(true);
    }
  });
  
  test('should reject personal info with invalid email', () => {
    const invalidPersonalInfo = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    };
    
    const result = validatePersonalInfo(invalidPersonalInfo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('email'))).toBe(true);
    }
  });
  
  test('should reject personal info with invalid date of birth', () => {
    const invalidPersonalInfo = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      dateOfBirth: 'not-a-date',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    };
    
    const result = validatePersonalInfo(invalidPersonalInfo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('dateOfBirth'))).toBe(true);
    }
  });
});

describe('Form Validation - Financial Info', () => {
  test('should validate valid financial info', () => {
    const validFinancialInfo = {
      annualIncome: 80000,
      employmentStatus: 'employed' as const,
      employerName: 'Acme Corp',
      jobTitle: 'Software Engineer',
      yearsEmployed: 5,
      monthlyExpenses: 2000,
      otherLoans: 500,
      creditScore: 750,
      bankruptcy: false,
      foreclosure: false
    };
    
    const result = validateFinancialInfo(validFinancialInfo);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validFinancialInfo);
    }
  });
  
  test('should reject financial info with negative income', () => {
    const invalidFinancialInfo = {
      annualIncome: -1000,
      employmentStatus: 'employed' as const,
      employerName: 'Acme Corp',
      jobTitle: 'Software Engineer',
      yearsEmployed: 5,
      monthlyExpenses: 2000,
      otherLoans: 500,
      creditScore: 750,
      bankruptcy: false,
      foreclosure: false
    };
    
    const result = validateFinancialInfo(invalidFinancialInfo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('annualIncome'))).toBe(true);
    }
  });
  
  test('should reject financial info with invalid credit score', () => {
    const invalidFinancialInfo = {
      annualIncome: 80000,
      employmentStatus: 'employed' as const,
      employerName: 'Acme Corp',
      jobTitle: 'Software Engineer',
      yearsEmployed: 5,
      monthlyExpenses: 2000,
      otherLoans: 500,
      creditScore: 900, // Max is 850
      bankruptcy: false,
      foreclosure: false
    };
    
    const result = validateFinancialInfo(invalidFinancialInfo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('creditScore'))).toBe(true);
    }
  });
  
  test('should not require employer name for unemployed applicants', () => {
    const unemployedFinancialInfo = {
      annualIncome: 20000,
      employmentStatus: 'unemployed' as const,
      monthlyExpenses: 1500,
      otherLoans: 200,
      creditScore: 680,
      bankruptcy: false,
      foreclosure: false
    };
    
    const result = validateFinancialInfo(unemployedFinancialInfo);
    expect(result.success).toBe(true);
  });
});

describe('Form Validation - Loan Details', () => {
  test('should validate valid loan details', () => {
    const validLoanDetails = {
      loanAmount: 150000,
      loanPurpose: 'home' as const,
      loanTerm: 60,
      collateral: true,
      collateralType: 'Property',
      collateralValue: 200000
    };
    
    const result = validateLoanDetails(validLoanDetails);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validLoanDetails);
    }
  });
  
  test('should reject loan details with zero or negative loan amount', () => {
    const invalidLoanDetails = {
      loanAmount: 0,
      loanPurpose: 'home' as const,
      loanTerm: 60,
      collateral: true,
      collateralType: 'Property',
      collateralValue: 200000
    };
    
    const result = validateLoanDetails(invalidLoanDetails);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('loanAmount'))).toBe(true);
    }
  });
  
  test('should reject loan details with invalid loan term', () => {
    const invalidLoanDetails = {
      loanAmount: 150000,
      loanPurpose: 'home' as const,
      loanTerm: -12,
      collateral: true,
      collateralType: 'Property',
      collateralValue: 200000
    };
    
    const result = validateLoanDetails(invalidLoanDetails);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('loanTerm'))).toBe(true);
    }
  });
  
  test('should require collateral type and value when collateral is true', () => {
    const invalidLoanDetails = {
      loanAmount: 150000,
      loanPurpose: 'home' as const,
      loanTerm: 60,
      collateral: true
      // Missing collateralType and collateralValue
    };
    
    const result = validateLoanDetails(invalidLoanDetails);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => 
        i.path.includes('collateralType') || i.path.includes('collateralValue')
      )).toBe(true);
    }
  });
  
  test('should not require collateral type and value when collateral is false', () => {
    const validLoanDetailsNoCollateral = {
      loanAmount: 50000,
      loanPurpose: 'personal' as const,
      loanTerm: 36,
      collateral: false
      // No collateralType or collateralValue
    };
    
    const result = validateLoanDetails(validLoanDetailsNoCollateral);
    expect(result.success).toBe(true);
  });
  
  test('should require otherPurposeDescription when loanPurpose is other', () => {
    const invalidLoanDetails = {
      loanAmount: 30000,
      loanPurpose: 'other' as const,
      loanTerm: 24,
      collateral: false
      // Missing otherPurposeDescription
    };
    
    const result = validateLoanDetails(invalidLoanDetails);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('otherPurposeDescription'))).toBe(true);
    }
  });
}); 