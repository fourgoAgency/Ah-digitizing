import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

function verifyToken(token?: string | null) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { admin?: boolean; role?: string };
    return decoded;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes: require admin_session cookie
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_session')?.value || null;
    const admin = verifyToken(token);
    if (!admin) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect designer routes: require session cookie with role 'designer'
  if (pathname.startsWith('/designer')) {
    const token = req.cookies.get('session')?.value || null;
    const payload = verifyToken(token) as { role?: string } | null;
    if (!payload || payload.role !== 'designer') {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/designer/:path*'],
};
