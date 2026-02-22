import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    // Public routes - no auth needed
    const publicRoutes = ['/', '/auth/login', '/auth/register', '/about', '/contact', '/privacy', '/terms'];
    const isPublicRoute = publicRoutes.some(route => pathname === route);
    const isApiAuth = pathname.startsWith('/api/auth');
    const isStaticFile = pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.');

    if (isPublicRoute || isApiAuth || isStaticFile) {
        return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    if (!token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based route protection
    if (pathname.startsWith('/dashboard/super-admin') && token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname.startsWith('/dashboard/institution') &&
        token.role !== 'INSTITUTION_ADMIN' && token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads|sw.js).*)'],
};
