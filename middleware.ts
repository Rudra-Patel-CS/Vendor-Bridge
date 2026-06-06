import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
import { canAccessRoute } from './lib/auth/permissions'
import { UserRole } from './lib/types/auth'

const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/auth/callback']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (!user) {
    // Not logged in
    if (!isPublicRoute && pathname !== '/') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }
    return supabaseResponse
  }

  // User is logged in
  const role = (user.user_metadata?.role || 'procurement_officer') as UserRole

  if (isPublicRoute || pathname === '/') {
    // Logged in user going to public route -> redirect to dashboard
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Check route access
  if (!canAccessRoute(role, pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/unauthorized'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, fonts, static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
