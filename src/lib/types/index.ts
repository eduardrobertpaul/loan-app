// Re-export all type modules
export * from './applicant';
export * from './financial';
export * from './loan';
export * from './note';
export * from './application';
export * from './evaluation';

// Status type
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'review';

// Error and success response types
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