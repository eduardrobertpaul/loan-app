'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// Basic schema for the form
const applicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(1, 'Address is required'),
  dateOfBirth: z.string(),
  
  // Financial Information
  income: z.number().min(0, 'Income must be a positive number'),
  monthlyExpenses: z.number().min(0, 'Monthly expenses must be a positive number'),
  otherLoans: z.number().min(0, 'Other loans must be a positive number'),
  creditScore: z.number().min(300).max(850, 'Credit score must be between 300 and 850'),
  
  // Loan Details
  loanAmount: z.number().min(1000, 'Loan amount must be at least 1000'),
  loanPurpose: z.string().min(1, 'Loan purpose is required'),
  loanTerm: z.number().min(1, 'Loan term must be at least 1 year'),
  collateral: z.enum(['yes', 'no']),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function ApplicationForm() {
  const { applicationForm, common } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const defaultValues: Partial<ApplicationFormValues> = {
    income: 0,
    monthlyExpenses: 0,
    otherLoans: 0,
    creditScore: 700,
    loanAmount: 10000,
    loanTerm: 5,
    collateral: 'no',
  };
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Format the data for the API
      const applicationData = {
        applicant: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          address: data.address,
          dateOfBirth: data.dateOfBirth,
          employmentStatus: 'employed', // Default value for now
        },
        financial: {
          income: data.income,
          monthlyExpenses: data.monthlyExpenses,
          otherLoans: data.otherLoans,
          creditScore: data.creditScore,
        },
        loan: {
          amount: data.loanAmount,
          purpose: data.loanPurpose,
          term: data.loanTerm,
          collateral: data.collateral,
          collateralType: data.collateral === 'yes' ? 'Property' : undefined,
          collateralValue: data.collateral === 'yes' ? data.loanAmount * 1.5 : undefined,
        }
      };
      
      // Submit to API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }
      
      const result = await response.json();
      
      // Redirect to applications page with success message
      router.push('/dashboard/applications?success=true');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  // For displaying values in review step
  const formValues = watch();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">{applicationForm.title}</h1>
      
      {/* Show error message if any */}
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Step indicator */}
      <div className="flex mb-8">
        <div className={`flex-1 border-t-4 pt-4 ${step >= 1 ? 'border-primary' : 'border-gray-300'}`}>
          <p className={`font-bold ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>
            {applicationForm.personalInfo}
          </p>
        </div>
        <div className={`flex-1 border-t-4 pt-4 ${step >= 2 ? 'border-primary' : 'border-gray-300'}`}>
          <p className={`font-bold ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>
            {applicationForm.financialInfo}
          </p>
        </div>
        <div className={`flex-1 border-t-4 pt-4 ${step >= 3 ? 'border-primary' : 'border-gray-300'}`}>
          <p className={`font-bold ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>
            {applicationForm.loanDetails}
          </p>
        </div>
        <div className={`flex-1 border-t-4 pt-4 ${step >= 4 ? 'border-primary' : 'border-gray-300'}`}>
          <p className={`font-bold ${step >= 4 ? 'text-primary' : 'text-gray-500'}`}>
            {applicationForm.review}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {applicationForm.firstName}
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {applicationForm.lastName}
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.email}
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.phone}
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.address}
              </label>
              <input
                type="text"
                {...register('address')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.dateOfBirth}
              </label>
              <input
                type="date"
                {...register('dateOfBirth')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
              >
                {common.next}
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Financial Information */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.annualIncome}
              </label>
              <input
                type="number"
                {...register('income', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.income && (
                <p className="mt-1 text-sm text-red-600">{errors.income.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.monthlyExpenses}
              </label>
              <input
                type="number"
                {...register('monthlyExpenses', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.monthlyExpenses && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlyExpenses.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.otherLoans}
              </label>
              <input
                type="number"
                {...register('otherLoans', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.otherLoans && (
                <p className="mt-1 text-sm text-red-600">{errors.otherLoans.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.creditScore}
              </label>
              <input
                type="number"
                {...register('creditScore', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.creditScore && (
                <p className="mt-1 text-sm text-red-600">{errors.creditScore.message}</p>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                {common.previous}
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
              >
                {common.next}
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Loan Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.loanAmount}
              </label>
              <input
                type="number"
                {...register('loanAmount', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.loanAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.loanAmount.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.loanPurpose}
              </label>
              <input
                type="text"
                {...register('loanPurpose')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.loanPurpose && (
                <p className="mt-1 text-sm text-red-600">{errors.loanPurpose.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.loanTerm}
              </label>
              <input
                type="number"
                {...register('loanTerm', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.loanTerm && (
                <p className="mt-1 text-sm text-red-600">{errors.loanTerm.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {applicationForm.collateral}
              </label>
              <select
                {...register('collateral')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.collateral && (
                <p className="mt-1 text-sm text-red-600">{errors.collateral.message}</p>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                {common.previous}
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
              >
                {common.next}
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{applicationForm.reviewTitle}</h3>
            
            {/* Personal Information Review */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">{applicationForm.personalInfo}</h4>
              <div className="grid grid-cols-2 gap-2">
                <p><span className="text-gray-500">Name:</span> {formValues.firstName} {formValues.lastName}</p>
                <p><span className="text-gray-500">Email:</span> {formValues.email}</p>
                <p><span className="text-gray-500">Phone:</span> {formValues.phone}</p>
                <p><span className="text-gray-500">Address:</span> {formValues.address}</p>
                <p><span className="text-gray-500">Date of Birth:</span> {formValues.dateOfBirth}</p>
              </div>
            </div>
            
            {/* Financial Information Review */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">{applicationForm.financialInfo}</h4>
              <div className="grid grid-cols-2 gap-2">
                <p><span className="text-gray-500">Annual Income:</span> {formValues.income}</p>
                <p><span className="text-gray-500">Monthly Expenses:</span> {formValues.monthlyExpenses}</p>
                <p><span className="text-gray-500">Other Loans:</span> {formValues.otherLoans}</p>
                <p><span className="text-gray-500">Credit Score:</span> {formValues.creditScore}</p>
              </div>
            </div>
            
            {/* Loan Details Review */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">{applicationForm.loanDetails}</h4>
              <div className="grid grid-cols-2 gap-2">
                <p><span className="text-gray-500">Loan Amount:</span> {formValues.loanAmount}</p>
                <p><span className="text-gray-500">Purpose:</span> {formValues.loanPurpose}</p>
                <p><span className="text-gray-500">Term (years):</span> {formValues.loanTerm}</p>
                <p><span className="text-gray-500">Collateral:</span> {formValues.collateral}</p>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                disabled={isSubmitting}
              >
                {common.previous}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {common.loading}
                  </div>
                ) : applicationForm.submit}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 