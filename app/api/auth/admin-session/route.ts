import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminAuth } from '@/lib/firebaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim().toLowerCase()) || ['admin@ahdigitizing.com'];

export async function POST(req: Request) {
  try {
    if (!adminAuth) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });

    // verify Firebase ID token
    const decoded = await adminAuth.verifyIdToken(idToken).catch(() => null);
    if (!decoded) return NextResponse.json({ error: 'Invalid idToken' }, { status: 401 });

    const email = decoded.email?.toLowerCase();
    if (!email || !ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Admin access denied', email }, { status: 403 });
    }

    const payload = { uid: decoded.uid, email, admin: true };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}