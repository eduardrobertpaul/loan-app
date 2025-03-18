import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Standard success response
 */
export function successResponse<T>(
  data: T, 
  message: string = 'Operation successful', 
  status: number = 200
) {
  return NextResponse.json(
    { message, data },
    { status }
  );
}

/**
 * Standard error response
 */
export function errorResponse(
  message: string, 
  status: number = 500, 
  errors?: Array<{ path: string, message: string }>
) {
  const response: { message: string; errors?: Array<{ path: string, message: string }> } = { message };
  
  if (errors) {
    response.errors = errors;
  }
  
  return NextResponse.json(
    response,
    { status }
  );
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: unknown) {
  if (error instanceof z.ZodError) {
    const errors = error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    
    return errorResponse('Validation error', 400, errors);
  }
  
  return errorResponse('An unexpected error occurred', 500);
}

/**
 * Not found response
 */
export function notFoundResponse(message: string = 'Resource not found') {
  return errorResponse(message, 404);
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(message: string = 'Authentication required') {
  return errorResponse(message, 401);
}

/**
 * Forbidden response
 */
export function forbiddenResponse(message: string = 'Access denied') {
  return errorResponse(message, 403);
}

/**
 * Created response (201)
 */
export function createdResponse<T>(data: T, message: string = 'Resource created successfully') {
  return successResponse(data, message, 201);
}

/**
 * No content response (204)
 */
export function noContentResponse() {
  return new NextResponse(null, { status: 204 });
} 