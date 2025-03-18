'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/utils/api-client';
import { LoanApplication } from '@/lib/types';

interface UseApplicationsOptions {
  status?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export function useApplications({
  status,
  searchQuery,
  page = 1,
  pageSize = 10
}: UseApplicationsOptions = {}) {
  const queryParams = new URLSearchParams();
  
  if (status && status !== 'all') {
    queryParams.append('status', status);
  }
  
  if (searchQuery) {
    queryParams.append('search', searchQuery);
  }
  
  queryParams.append('page', page.toString());
  queryParams.append('pageSize', pageSize.toString());
  
  const queryKey = ['applications', { status, searchQuery, page, pageSize }];
  const queryFn = async () => {
    const url = `/api/applications?${queryParams.toString()}`;
    const response = await apiClient.get<LoanApplication[]>(url);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return {
      applications: response.data || [],
      total: response.data?.length || 0
    };
  };
  
  return useQuery({
    queryKey,
    queryFn
  });
} 