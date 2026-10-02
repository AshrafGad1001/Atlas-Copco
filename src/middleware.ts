import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If there's no token
  if (!token || token === 'none') {
    if (!isPublicRoute && !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If there is a token, try to parse it
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    
    // In edge runtime, we use jose instead of jsonwebtoken
    const { payload } = await jose.jwtVerify(token, secret);
    
    const role = payload.role as string;

    if (isPublicRoute) {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      if (role === 'engineer') return NextResponse.redirect(new URL('/engineer/profile', request.url));
      return NextResponse.next();
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/engineer/profile', request.url));
    }

    if (pathname.startsWith('/engineer') && role !== 'engineer') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token
    if (!isPublicRoute) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
