import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { authConfig } from '@/lib/auth.config'
import NextAuth from 'next-auth'
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server'

const intlMiddleware = createMiddleware(routing)
const { auth: nextAuthMiddleware } = NextAuth(authConfig)

export default function middleware(req: NextRequest, event: NextFetchEvent) {
    const { pathname } = req.nextUrl

    // Skip NextAuth for static files and standard store routes to avoid domain enforcing redirects
    // We only need it for admin and api/auth
    const isNextAuthRoute = pathname.startsWith('/api/auth') || pathname.startsWith('/admin')

    if (isNextAuthRoute) {
        // @ts-ignore - NextAuth middleware types can be restrictive
        return nextAuthMiddleware(req, event)
    }

    // Standard store routes use intlMiddleware
    return intlMiddleware(req)
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
