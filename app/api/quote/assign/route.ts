import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const designerEmail = String(body?.designerEmail || '').trim().toLowerCase();
    const designerName = String(body?.designerName || '').trim();
    const orderType = String(body?.orderType || '').trim();
    const quoteId = String(body?.quoteId || '').trim();
    const orderNumber = String(body?.orderNumber || '').trim();
    const submissionType = body?.submissionType === 'order' ? 'order' : 'quote';
    const recordLabel = submissionType === 'order' ? 'order' : 'quote';
    const numberLabel = submissionType === 'order' ? 'Order No' : 'Quote No';

    if (!designerEmail || !designerName || !orderType || !quoteId || !orderNumber) {
      return NextResponse.json(
        { error: 'designerEmail, designerName, orderType, quoteId and orderNumber are required.' },
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

    const configuredPort = Number(smtpPort);
    const configuredSecure = process.env.SMTP_SECURE === 'true';

    const createTransport = (allowRelaxedTls: boolean, port = configuredPort, secure = configuredSecure) =>
      nodemailer.createTransport({
        host: smtpHost,
        port,
        secure,
        requireTLS: !secure,
        tls: {
          rejectUnauthorized: allowRelaxedTls ? false : true,
        },
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

    const sendMessage = async (allowRelaxedTls: boolean, port = configuredPort, secure = configuredSecure) => {
      const transport = createTransport(allowRelaxedTls, port, secure);
      await transport.sendMail({
        from: fromAddress,
        to: designerEmail,
        subject: `New ${recordLabel} assigned: ${orderType}`,
        text: `Hi ${designerName}, a new ${orderType} ${recordLabel} (${numberLabel}: ${orderNumber}) has been assigned to you.`,
        html: `<p>Hi <strong>${designerName}</strong>,</p><p>A new <strong>${orderType}</strong> ${recordLabel} (${numberLabel}: <strong>${orderNumber}</strong>) has been assigned to you.</p>`,
      });
    };

    try {
      await sendMessage(process.env.SMTP_ALLOW_SELF_SIGNED_CERTS === 'true');
    } catch (mailError: unknown) {
      const message = mailError instanceof Error ? mailError.message : '';
      const isConnectionFailure = /ECONNREFUSED|ETIMEDOUT|ESOCKET/i.test(message);
      const isCertificateFailure = message.toLowerCase().includes('certificate');
      if (isConnectionFailure && configuredPort === 465) {
        await sendMessage(true, 587, false);
      } else if (isCertificateFailure) {
        await sendMessage(true);
      } else {
        throw mailError;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('Quote assign email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage || 'Failed to send designer email.' }, { status: 500 });
  }
}
