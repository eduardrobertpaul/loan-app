/**
 * Form validation schemas for loan application forms
 */
import { z } from 'zod';
import { PersonalInfo, FinancialInfo, LoanDetails } from '../types';

// Schema for personal information
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().refine(value => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }, 'Invalid date of birth'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters')
});

// Schema for financial information
export const financialInfoSchema = z.object({
  annualIncome: z.number().positive('Annual income must be greater than 0'),
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'retired']),
  employerName: z.string().optional().refine(
    (val, ctx) => {
      if (ctx.parent.employmentStatus === 'employed' || ctx.parent.employmentStatus === 'self-employed') {
        return val && val.length > 0;
      }
      return true;
    },
    { message: 'Employer name is required for employed applicants' }
  ),
  jobTitle: z.string().optional().refine(
    (val, ctx) => {
      if (ctx.parent.employmentStatus === 'employed' || ctx.parent.employmentStatus === 'self-employed') {
        return val && val.length > 0;
      }
      return true;
    },
    { message: 'Job title is required for employed applicants' }
  ),
  yearsEmployed: z.number().optional().refine(
    (val, ctx) => {
      if (ctx.parent.employmentStatus === 'employed' || ctx.parent.employmentStatus === 'self-employed') {
        return val !== undefined && val >= 0;
      }
      return true;
    },
    { message: 'Years employed must be a positive number' }
  ),
  monthlyExpenses: z.number().nonnegative('Monthly expenses must be 0 or greater'),
  otherLoans: z.number().nonnegative('Other loans must be 0 or greater'),
  creditScore: z.number().min(300, 'Credit score must be at least 300').max(850, 'Credit score cannot exceed 850'),
  bankruptcy: z.boolean(),
  foreclosure: z.boolean()
});

// Schema for loan details
export const loanDetailsSchema = z.object({
  loanAmount: z.number().positive('Loan amount must be greater than 0'),
  loanPurpose: z.enum(['home', 'auto', 'education', 'personal', 'business', 'debt_consolidation', 'other']),
  otherPurposeDescription: z.string().optional().refine(
    (val, ctx) => {
      if (ctx.parent.loanPurpose === 'other') {
        return val && val.length > 0;
      }
      return true;
    },
    { message: 'Description is required when purpose is "other"' }
  ),
  loanTerm: z.number().positive('Loan term must be greater than 0'),
  collateral: z.boolean(),
  collateralType: z.string().optional().refine(
    (val, ctx) => {
      if (ctx.parent.collateral === true) {
        return val && val.length > 0;
      }
      return true;
    },
    { message: 'Collateral type is required when collateral is provided' }
  ),
  collateralValue: z.number().optional().refine(
    (val, ctx) => {
      if (ctx.parent.collateral === true) {
        return val !== undefined && val > 0;
      }
      return true;
    },
    { message: 'Collateral value must be greater than 0' }
  )
});

/**
 * Validate personal information form data
 */
export function validatePersonalInfo(data: unknown) {
  return personalInfoSchema.safeParse(data);
}

/**
 * Validate financial information form data
 */
export function validateFinancialInfo(data: unknown) {
  return financialInfoSchema.safeParse(data);
}

/**
 * Validate loan details form data
 */
export function validateLoanDetails(data: unknown) {
  return loanDetailsSchema.safeParse(data);
}

/**
 * Validate complete application form data
 */
export function validateApplication(data: {
  personalInfo: unknown;
  financialInfo: unknown;
  loanDetails: unknown;
}) {
  const personalResult = validatePersonalInfo(data.personalInfo);
  const financialResult = validateFinancialInfo(data.financialInfo);
  const loanResult = validateLoanDetails(data.loanDetails);
  
  const errors: Record<string, string[]> = {};
  let isValid = true;
  
  if (!personalResult.success) {
    isValid = false;
    errors.personalInfo = personalResult.error.issues.map(issue => issue.message);
  }
  
  if (!financialResult.success) {
    isValid = false;
    errors.financialInfo = financialResult.error.issues.map(issue => issue.message);
  }
  
  if (!loanResult.success) {
    isValid = false;
    errors.loanDetails = loanResult.error.issues.map(issue => issue.message);
  }
  
  return {
    isValid,
    errors,
    data: isValid ? {
      personalInfo: personalResult.data,
      financialInfo: financialResult.data,
      loanDetails: loanResult.data
    } : undefined
  };
} 