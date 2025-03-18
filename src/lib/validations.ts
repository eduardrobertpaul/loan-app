import { z } from 'zod';

// Personal Information Validation Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' }),
  dateOfBirth: z.string().refine((date) => {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    return new Date(date) <= eighteenYearsAgo;
  }, { message: 'Applicant must be at least 18 years old' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters' }),
  state: z.string().min(2, { message: 'State must be at least 2 characters' }),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: 'Please enter a valid ZIP code' }),
});

// Financial Information Validation Schema
export const financialInfoSchema = z.object({
  annualIncome: z.number()
    .positive({ message: 'Annual income must be greater than 0' })
    .min(10000, { message: 'Annual income must be at least $10,000' }),
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'retired']),
  employerName: z.string().min(2, { message: 'Employer name must be at least 2 characters' }).optional(),
  jobTitle: z.string().min(2, { message: 'Job title must be at least 2 characters' }).optional(),
  yearsEmployed: z.number().min(0, { message: 'Years employed must be 0 or greater' }).optional(),
  monthlyExpenses: z.number().nonnegative({ message: 'Monthly expenses must be 0 or greater' }),
  otherLoans: z.number().nonnegative({ message: 'Other loans must be 0 or greater' }),
  creditScore: z.number().min(300, { message: 'Credit score must be between 300 and 850' })
    .max(850, { message: 'Credit score must be between 300 and 850' }),
  bankruptcy: z.boolean(),
  foreclosure: z.boolean(),
});

// Loan Details Validation Schema
export const loanDetailsSchema = z.object({
  loanAmount: z.number()
    .positive({ message: 'Loan amount must be greater than 0' })
    .min(1000, { message: 'Loan amount must be at least $1,000' }),
  loanPurpose: z.enum(['home', 'auto', 'education', 'personal', 'business', 'debt_consolidation', 'other']),
  loanTerm: z.number().int().positive().min(6, { message: 'Loan term must be at least 6 months' }),
  otherPurposeDescription: z.string().optional(),
  collateral: z.boolean(),
  collateralType: z.string().optional(),
  collateralValue: z.number().nonnegative().optional(),
});

// Full Loan Application Schema
export const loanApplicationSchema = z.object({
  personalInfo: personalInfoSchema,
  financialInfo: financialInfoSchema,
  loanDetails: loanDetailsSchema,
}); 