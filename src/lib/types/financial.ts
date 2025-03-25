import { z } from 'zod';

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