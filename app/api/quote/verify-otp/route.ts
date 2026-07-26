import { NextResponse } from 'next/server';
import { verifyQuoteOtp } from '@/lib/otpCache';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const otp = String(body?.otp || '').trim();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const isValid = verifyQuoteOtp(email, otp);

    if (!isValid) {
      return NextResponse.json({ error: 'OTP is invalid or has expired.' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('Verify OTP error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'OTP verification failed.' }, { status: 500 });
  }
}

