import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Get token from cookies or authorization header.
  // Note: Since this is a client-side localStorage implementation for now,
  // robust SSR protection usually requires setting an HTTP-only cookie on login.
  // For this edge middleware to work right now, we would need the client to set a cookie.
  
  // As a quick fallback for localStorage, we allow the route but the client-side
  // layout/dashboard will redirect if the token is missing.

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
