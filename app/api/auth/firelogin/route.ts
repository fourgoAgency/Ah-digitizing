import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminFirestore, emailToId } from '@/lib/firebaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export async function POST(req: Request) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

    const id = emailToId(email.toLowerCase());
    const snap = await adminFirestore.doc(`users/${id}`).get();
    if (!snap.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const data = snap.data() as { password?: string; email?: string; role?: string };
    const hashed = data.password;
    if (!hashed) return NextResponse.json({ error: 'No password set' }, { status: 400 });

    const match = await bcrypt.compare(password, hashed);
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    if ((data.role || 'user') === 'user') {
      await adminFirestore.doc(`users/${id}`).set(
        {
          email: data.email?.toLowerCase() || email.toLowerCase(),
          role: 'user',
          updatedAt: new Date(),
          lastSignInAt: new Date(),
        },
        { merge: true }
      );
    }

    const payload = { email: data.email, role: data.role || 'user', id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const res = NextResponse.json({ ok: true, role: payload.role });
    // set HttpOnly cookie
    res.cookies.set('session', token, {
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
