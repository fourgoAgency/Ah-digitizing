import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

function verifyToken(token?: string | null) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { admin?: boolean };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )admin_session=([^;]+)/);
    const token = match?.[1] || null;
    const decoded = verifyToken(token);

    if (!decoded?.admin) {
      return NextResponse.json({ isAdmin: false, error: 'Not authorized' }, { status: 401 });
    }

    return NextResponse.json({ isAdmin: true });
  } catch (err: unknown) {
    console.error('Verify admin error:', err);
    return NextResponse.json({ isAdmin: false, error: err instanceof Error ? err.message : 'Verification failed' }, { status: 500 });
  }
}
