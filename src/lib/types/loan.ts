import { z } from 'zod';

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