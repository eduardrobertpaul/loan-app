/**
 * API Client utility for making fetch requests with proper error handling
 */

type ApiOptions<T> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: T;
  headers?: Record<string, string>;
};

type ApiResponse<T> = {
  data?: T;
  error?: string;
  errors?: Array<{ path: string; message: string }>;
  status: number;
};

/**
 * Makes an API request to the specified endpoint
 */
export async function apiRequest<TData, TResponse = any>(
  options: ApiOptions<TData>
): Promise<ApiResponse<TResponse>> {
  const { method, url, data, headers = {} } = options;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      return {
        error: responseData.message || 'An error occurred',
        errors: responseData.errors,
        status: response.status,
      };
    }
    
    return {
      data: responseData.data,
      status: response.status,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: 'Failed to connect to the server. Please try again.',
      status: 500,
    };
  }
}

/**
 * API client with methods for common operations
 */
export const apiClient = {
  get: <T>(url: string, headers?: Record<string, string>) => 
    apiRequest<null, T>({ method: 'GET', url, headers }),
    
  post: <TData, TResponse = any>(url: string, data: TData, headers?: Record<string, string>) => 
    apiRequest<TData, TResponse>({ method: 'POST', url, data, headers }),
    
  put: <TData, TResponse = any>(url: string, data: TData, headers?: Record<string, string>) => 
    apiRequest<TData, TResponse>({ method: 'PUT', url, data, headers }),
    
  delete: <T>(url: string, headers?: Record<string, string>) => 
    apiRequest<null, T>({ method: 'DELETE', url, headers }),
}; 