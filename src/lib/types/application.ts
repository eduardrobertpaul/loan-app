import { z } from 'zod';

// Define the application-related schemas and types
import { noteSchema } from './note';
import { applicantSchema } from './applicant';
import { financialSchema } from './financial';
import { loanSchema } from './loan';

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