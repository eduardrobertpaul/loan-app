'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAppStore } from '../store';
import { createApplication } from '../api';
import { useRouter } from 'next/navigation';

// Define a simpler schema for this example
const loanApplicationSchema = z.object({
  applicantName: z.string().min(2, 'Name must be at least 2 characters'),
  applicantAge: z.number().int().min(18, 'Applicant must be at least 18 years old'),
  income: z.number().positive('Income must be greater than 0'),
  creditScore: z.number().min(300, 'Credit score must be between 300 and 850').max(850, 'Credit score must be between 300 and 850'),
  loanAmount: z.number().positive('Loan amount must be greater than 0'),
  loanTerm: z.number().int().positive('Loan term must be positive'),
  purpose: z.string().min(1, 'Purpose is required'),
});

export type LoanFormValues = z.infer<typeof loanApplicationSchema>;

export function useLoanForm() {
  const router = useRouter();
  const { setLoading, setError, addApplication } = useAppStore();
  
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      applicantName: '',
      applicantAge: undefined,
      income: undefined,
      creditScore: undefined,
      loanAmount: undefined,
      loanTerm: undefined,
      purpose: '',
    },
  });

  const onSubmit = async (data: LoanFormValues) => {
    try {
      setLoading(true);
      setError(null);
      
      // Submit to "API"
      const newApplication = await createApplication(data);
      
      // Update local state
      addApplication(newApplication);
      
      // Navigate to success page or dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
} 