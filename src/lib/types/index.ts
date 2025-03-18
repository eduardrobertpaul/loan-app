import { z } from 'zod';

// Applicant information schema and type
export const applicantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(1, 'Address is required'),
  dateOfBirth: z.string(),
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'retired']),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  yearsEmployed: z.number().min(0).optional(),
});

export type Applicant = z.infer<typeof applicantSchema>;

// Financial information schema and type
export const financialSchema = z.object({
  income: z.number().min(0, 'Income must be a positive number'),
  monthlyExpenses: z.number().min(0, 'Monthly expenses must be a positive number'),
  otherLoans: z.number().min(0, 'Other loans must be a positive number'),
  creditScore: z.number().min(300).max(850, 'Credit score must be between 300 and 850'),
  bankruptcies: z.number().min(0).optional(),
  existingProperties: z.number().min(0).optional(),
});

export type Financial = z.infer<typeof financialSchema>;

// Loan details schema and type
export const loanSchema = z.object({
  amount: z.number().min(1000, 'Loan amount must be at least 1000'),
  purpose: z.string().min(1, 'Loan purpose is required'),
  term: z.number().min(1, 'Loan term must be at least 1 year'),
  collateral: z.enum(['yes', 'no']),
  collateralType: z.string().optional(),
  collateralValue: z.number().min(0).optional(),
  interestRate: z.number().min(0).optional(),
  monthlyPayment: z.number().min(0).optional(),
});

export type Loan = z.infer<typeof loanSchema>;

// Note/Activity schema and type
export const noteSchema = z.object({
  id: z.string(),
  text: z.string(),
  author: z.string(),
  createdAt: z.string(),
});

export type Note = z.infer<typeof noteSchema>;

// Status type
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'review';

// Full application schema and type
export const applicationSchema = z.object({
  id: z.string().optional(),
  applicant: applicantSchema,
  financial: financialSchema,
  loan: loanSchema,
  status: z.enum(['pending', 'approved', 'rejected', 'review']).default('pending'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  notes: z.array(noteSchema).optional(),
  evaluationScore: z.number().optional(),
  decisionReason: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
});

export type LoanApplication = z.infer<typeof applicationSchema>;

// Recommendation schema and type for system evaluation
export const recommendationSchema = z.object({
  status: z.enum(['Approve', 'Review', 'Decline']),
  message: z.string(),
  score: z.number(),
  factors: z.array(z.object({
    name: z.string(),
    impact: z.enum(['positive', 'negative', 'neutral']),
    description: z.string(),
  })),
});

export type Recommendation = z.infer<typeof recommendationSchema>;

// Error response schema and type
export const errorResponseSchema = z.object({
  message: z.string(),
  errors: z.array(z.object({
    path: z.string(),
    message: z.string(),
  })).optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Success response schema
export const successResponseSchema = z.object({
  message: z.string(),
  data: z.any(),
});

export type SuccessResponse = z.infer<typeof successResponseSchema>;

// Evaluation criteria and thresholds for rule-based engine
export const evaluationCriteriaSchema = z.object({
  minimumCreditScore: z.number(),
  maximumDtiRatio: z.number(),
  minimumIncome: z.number(),
  maximumLoanToIncomeRatio: z.number(),
  maximumLoanToValueRatio: z.number().optional(),
  minimumEmploymentYears: z.number(),
  bankruptcyImpact: z.number(),
});

export type EvaluationCriteria = z.infer<typeof evaluationCriteriaSchema>;

// Default evaluation criteria
export const defaultEvaluationCriteria: EvaluationCriteria = {
  minimumCreditScore: 650,
  maximumDtiRatio: 43,
  minimumIncome: 25000,
  maximumLoanToIncomeRatio: 3,
  maximumLoanToValueRatio: 80,
  minimumEmploymentYears: 1,
  bankruptcyImpact: -100,
}; 