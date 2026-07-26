import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const designerEmail = String(body?.designerEmail || '').trim().toLowerCase();
    const designerName = String(body?.designerName || '').trim();
    const orderType = String(body?.orderType || '').trim();
    const quoteId = String(body?.quoteId || '').trim();

    if (!designerEmail || !designerName || !orderType || !quoteId) {
      return NextResponse.json(
        { error: 'designerEmail, designerName, orderType and quoteId are required.' },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromAddress = process.env.EMAIL_FROM || smtpUser;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromAddress) {
      return NextResponse.json({ error: 'SMTP email settings are not configured.' }, { status: 500 });
    }

    const createTransport = (allowRelaxedTls: boolean) =>
      nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: process.env.SMTP_SECURE === 'true',
        tls: {
          rejectUnauthorized: allowRelaxedTls ? false : true,
        },
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

    const sendMessage = async (allowRelaxedTls: boolean) => {
      const transport = createTransport(allowRelaxedTls);
      await transport.sendMail({
        from: fromAddress,
        to: designerEmail,
        subject: `New quote assigned: ${orderType}`,
        text: `Hi ${designerName}, a new ${orderType} quote (ID: ${quoteId}) has been assigned to you.`,
        html: `<p>Hi <strong>${designerName}</strong>,</p><p>A new <strong>${orderType}</strong> quote (<strong>${quoteId}</strong>) has been assigned to you.</p>`,
      });
    };

    try {
      await sendMessage(process.env.SMTP_ALLOW_SELF_SIGNED_CERTS === 'true');
    } catch (mailError: unknown) {
      const message = mailError instanceof Error ? mailError.message : '';
      if (!message.toLowerCase().includes('self-signed certificate')) throw mailError;
      await sendMessage(true);
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('Quote assign email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage || 'Failed to send designer email.' }, { status: 500 });
  }
}
