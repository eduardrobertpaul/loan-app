'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchApplications, 
  fetchApplicationById, 
  createApplication, 
  updateApplication, 
  deleteApplication 
} from '../api';
import { LoanApplication } from '../types';

// Hook for fetching all applications
export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });
}

// Hook for fetching a single application by ID
export function useApplication(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => fetchApplicationById(id),
    enabled: !!id,
  });
}

// Hook for creating a new application
export function useCreateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<LoanApplication, 'id' | 'status' | 'createdAt'>) => 
      createApplication(data),
    onSuccess: () => {
      // Invalidate the applications query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

// Hook for updating an application
export function useUpdateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LoanApplication> }) => 
      updateApplication(id, data),
    onSuccess: (updatedApplication) => {
      // Update both the list and the individual application in the cache
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', updatedApplication.id] });
    },
  });
}

// Hook for deleting an application
export function useDeleteApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: (_data, id) => {
      // Update the cache after successful deletion
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      // Remove the individual application from the cache
      queryClient.removeQueries({ queryKey: ['application', id] });
    },
  });
} 