import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/login') return NextResponse.next()

  const session = request.cookies.get('admin_session')?.value
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const expected = await hashPassword(process.env.ADMIN_PASSWORD ?? '')
  if (session !== expected) {
    const res = NextResponse.redirect(new URL('/login', request.url))
    res.cookies.delete('admin_session')
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
