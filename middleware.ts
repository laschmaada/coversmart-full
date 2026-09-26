import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ─── ROUTE CONFIG ─────────────────────────────────────────────────────────────

const PROTECTED_PATHS = ["/dashboard"]
const AUTH_PATHS      = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token        = request.cookies.get("cs_auth_token")?.value
  const isAuthed     = !!token

  // Redirect unauthenticated users away from protected routes
  if (PROTECTED_PATHS.some(p => pathname.startsWith(p)) && !isAuthed) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_PATHS.some(p => pathname.startsWith(p)) && isAuthed) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard/overview"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
