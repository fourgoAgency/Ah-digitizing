import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server is not configured for Firebase Admin.' }, { status: 500 });
    }

    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const otp = String(body?.otp || '').trim();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const snapshot = await adminFirestore
      .collection('quoteOtps')
      .where('email', '==', email)
      .where('used', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const now = Date.now();
    const validDoc = snapshot.docs.find((doc) => {
      const data = doc.data();
      return data.code === otp && data.expiresAt > now;
    });

    if (!validDoc) {
      return NextResponse.json({ error: 'OTP is invalid or has expired.' }, { status: 400 });
    }

    await validDoc.ref.update({ used: true, verifiedAt: Date.now() });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('Verify OTP error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'OTP verification failed.' }, { status: 500 });
  }
}

