'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/utils/api-client';

interface EvaluationResult {
  score: number;
  maxScore: number;
  approved: boolean;
  factors: {
    name: string;
    score: number;
    maxScore: number;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  summary: string;
}

export function useEvaluation(applicationId: string) {
  // Fetch current evaluation if it exists
  const {
    data: evaluation,
    isLoading: isEvaluationLoading,
    isError: isEvaluationError,
    error: evaluationError,
    refetch: refetchEvaluation
  } = useQuery({
    queryKey: ['evaluation', applicationId],
    queryFn: async () => {
      const response = await apiClient.get<EvaluationResult>(`/api/applications/${applicationId}/evaluation`);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    enabled: !!applicationId,
  });
  
  // Mutation for running a new evaluation
  const {
    mutate: runEvaluation,
    isPending: isEvaluating,
    error: evaluatingError,
    data: newEvaluation,
  } = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<null, EvaluationResult>(`/api/applications/${applicationId}/evaluate`, null);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Refresh evaluation data after running a new evaluation
      refetchEvaluation();
    },
  });
  
  return {
    evaluation,
    isEvaluationLoading,
    isEvaluationError,
    evaluationError,
    runEvaluation,
    isEvaluating,
    evaluatingError,
    newEvaluation,
  };
} 