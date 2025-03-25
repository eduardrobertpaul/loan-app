import { z } from 'zod';
import { LoanApplication } from './index';

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