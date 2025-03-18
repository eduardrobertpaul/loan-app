'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/utils/api-client';

interface UseFormSubmitOptions<TData, TResponse> {
  url: string;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: string, errors?: Array<{ path: string; message: string }>) => void;
  transform?: (data: TData) => any;
}

interface UseFormSubmitResult<TData> {
  submit: (data: TData) => Promise<void>;
  loading: boolean;
  error: string | null;
  errors: Record<string, string> | null;
  reset: () => void;
}

/**
 * Custom hook for handling form submissions with loading and error states
 */
export function useFormSubmit<TData, TResponse = any>({
  url,
  onSuccess,
  onError,
  transform
}: UseFormSubmitOptions<TData, TResponse>): UseFormSubmitResult<TData> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const reset = () => {
    setError(null);
    setErrors(null);
  };

  const submit = async (data: TData) => {
    setLoading(true);
    reset();

    try {
      const transformedData = transform ? transform(data) : data;
      const response = await apiClient.post<typeof transformedData, TResponse>(url, transformedData);

      if (response.error) {
        setError(response.error);
        
        // Convert array of errors to record for easier form integration
        if (response.errors && response.errors.length > 0) {
          const errorRecord: Record<string, string> = {};
          response.errors.forEach(err => {
            errorRecord[err.path] = err.message;
          });
          setErrors(errorRecord);
        }
        
        onError?.(response.error, response.errors);
      } else {
        onSuccess?.(response.data as TResponse);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, errors, reset };
} 