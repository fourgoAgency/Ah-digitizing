import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value || null;
    if (!token) return NextResponse.json({ authenticated: false });

    const payload = jwt.verify(token, JWT_SECRET) as { uid?: string; email?: string; role?: string };
    return NextResponse.json({ authenticated: true, user: payload }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
