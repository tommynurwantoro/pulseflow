import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Protected routes
  const protectedRoutes = ['/dashboard', '/history', '/month', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.nextUrl.origin)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/history/:path*',
    '/month/:path*',
    '/settings/:path*',
  ],
}
