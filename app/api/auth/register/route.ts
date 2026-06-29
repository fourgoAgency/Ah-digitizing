import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { adminFirestore, emailToId } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const id = emailToId(email.toLowerCase());
    const hashed = await bcrypt.hash(password, 10);

    // use admin from firebaseAdmin for serverTimestamp
    const admin = await import('@/lib/firebaseAdmin').then((m) => m.default);
    const serverTs = admin?.firestore?.FieldValue?.serverTimestamp ? admin.firestore.FieldValue.serverTimestamp() : new Date();
    await adminFirestore.doc(`users/${id}`).set(
      {
        name: name || null,
        email: email.toLowerCase(),
        password: hashed,
        role: role === 'designer' ? 'designer' : 'user',
        createdAt: serverTs,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
