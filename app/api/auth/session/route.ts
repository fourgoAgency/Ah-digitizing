import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    if (!token) return NextResponse.json({ authenticated: false });

    const payload = jwt.verify(token, JWT_SECRET) as { uid?: string; email?: string; role?: string };
    return NextResponse.json({ authenticated: true, user: payload });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
