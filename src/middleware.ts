import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // If the path starts with /api, check for a valid session
  if (path.startsWith('/api')) {
    const token = await getToken({ req: request });
    
    // If there's no token, return a 401 response
    if (!token) {
      return new NextResponse(
        JSON.stringify({
          message: 'Authentication required',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
  
  // Continue with the request if authenticated or not an API route
  return NextResponse.next();
}

// Configure the middleware to only run on API routes
export const config = {
  matcher: [
    // Match all API routes except auth
    '/api/:path*',
    // Don't match API auth routes
    '/((?!api/auth).*)',
  ],
}; 