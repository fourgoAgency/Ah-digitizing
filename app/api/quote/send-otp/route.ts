import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { adminFirestore } from '@/lib/firebaseAdmin';

const DEFAULT_OTP_EXPIRE_MS = 5 * 60 * 1000;

export async function POST(req: Request) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server is not configured for Firebase Admin.' }, { status: 500 });
    }

    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: 'Email is required to send OTP.' }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromAddress = process.env.EMAIL_FROM || smtpUser;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromAddress) {
      return NextResponse.json({ error: 'SMTP email settings are not configured.' }, { status: 500 });
    }

    const transport = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + DEFAULT_OTP_EXPIRE_MS;

    await adminFirestore.collection('quoteOtps').add({
      email,
      code: otp,
      expiresAt,
      createdAt: Date.now(),
      used: false,
    });

    await transport.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Your AH Digitizing quote verification code',
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes.</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Send OTP error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'Failed to send OTP.' }, { status: 500 });
  }
}

