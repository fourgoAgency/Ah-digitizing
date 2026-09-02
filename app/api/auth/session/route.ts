import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export async function GET(req: NextRequest) {
  try {
    // Check for custom user session first
    let token = req.cookies.get('session')?.value || null;
    let isAdmin = false;
    
    // Check for admin session (Firebase Auth admin)
    if (!token) {
      token = req.cookies.get('admin_session')?.value || null;
      if (token) isAdmin = true;
    }
    
    if (!token) return NextResponse.json({ authenticated: false });

    const payload = jwt.verify(token, JWT_SECRET) as { uid?: string; email?: string; role?: string; admin?: boolean };
    
    // For admin_session cookie, ensure role is set to 'admin'
    const user = isAdmin ? { ...payload, role: 'admin' } : payload;
    
    return NextResponse.json({ authenticated: true, user }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
