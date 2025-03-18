'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/utils/api-client';
import { LoanApplication } from '@/lib/types';

export function useApplication(id: string) {
  const queryClient = useQueryClient();
  
  // Fetch a single application
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const response = await apiClient.get<LoanApplication>(`/api/applications/${id}`);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id,
  });
  
  // Mutation for processing an application (approve/reject)
  const processMutation = useMutation({
    mutationFn: async ({ 
      action, 
      notes 
    }: { 
      action: 'approve' | 'reject', 
      notes?: string 
    }) => {
      const response = await apiClient.post(`/api/applications/${id}/process`, {
        action,
        notes
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries when application is processed
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
  
  // Mutation for adding notes to an application
  const addNoteMutation = useMutation({
    mutationFn: async (noteText: string) => {
      const response = await apiClient.post(`/api/applications/${id}/notes`, {
        note: noteText
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate current application query to refresh data
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    },
  });
  
  return {
    application: data,
    isLoading,
    isError,
    error,
    processApplication: processMutation.mutate,
    isProcessing: processMutation.isPending,
    processingError: processMutation.error,
    addNote: addNoteMutation.mutate,
    isAddingNote: addNoteMutation.isPending,
    addNoteError: addNoteMutation.error,
  };
} 