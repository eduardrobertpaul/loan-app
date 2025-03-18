/**
 * Type definitions for the loan application system
 */

// Loan application data structure
export interface LoanApplication {
  id: string;
  applicantName: string;
  applicantAge: number;
  income: number;
  creditScore: number;
  loanAmount: number;
  loanTerm: number; // in months
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Personal information form data
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

// Financial information form data
export interface FinancialInfo {
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
}

// Loan details form data
export interface LoanDetails {
  loanAmount: number;
  loanPurpose: 'home' | 'auto' | 'education' | 'personal' | 'business' | 'debt_consolidation' | 'other';
  loanTerm: number;
  otherPurposeDescription?: string;
  collateral: boolean;
  collateralType?: string;
  collateralValue?: number;
}

// Complete loan application form data
export interface LoanApplicationFormData {
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
  loanDetails: LoanDetails;
} 