import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { storeQuoteOtp } from '@/lib/otpCache';

const DEFAULT_OTP_EXPIRE_MS = 5 * 60 * 1000;

const createTransport = (host: string, port: string, user: string, pass: string, allowSelfSigned: boolean) =>
  nodemailer.createTransport({
    host,
    port: Number(port),
    secure: process.env.SMTP_SECURE === 'true',
    tls: {
      rejectUnauthorized: !allowSelfSigned ? true : false,
    },
    auth: {
      user,
      pass,
    },
  });

export async function POST(req: Request) {
  try {
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + DEFAULT_OTP_EXPIRE_MS;

    storeQuoteOtp(email, otp, expiresAt);

    const sendMessage = async (allowSelfSigned: boolean) => {
      const transport = createTransport(smtpHost, smtpPort, smtpUser, smtpPass, allowSelfSigned);
      await transport.sendMail({
        from: fromAddress,
        to: email,
        subject: 'Your AH Digitizing quote verification code',
        text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
        html: `<p>Your OTP code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes.</p>`,
      });
    };

    try {
      await sendMessage(process.env.SMTP_ALLOW_SELF_SIGNED_CERTS === 'true');
    } catch (mailError: unknown) {
      const message = mailError instanceof Error ? mailError.message : '';
      if (!message.toLowerCase().includes('self-signed certificate')) {
        throw mailError;
      }
      await sendMessage(true);
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('Send OTP error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'Failed to send OTP.' }, { status: 500 });
  }
}

