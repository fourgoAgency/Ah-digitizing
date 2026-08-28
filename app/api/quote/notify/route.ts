import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { createQuoteNotification } from '@/lib/notificationHelper';

const createTransport = (host: string, port: string, user: string, pass: string, allowSelfSigned: boolean) =>
  nodemailer.createTransport({
    host,
    port: Number(port),
    family: 4,
    secure: process.env.SMTP_SECURE === 'true',
    tls: {
      rejectUnauthorized: !allowSelfSigned ? true : false,
    },
    auth: {
      user,
      pass,
    },
  } as SMTPTransport.Options);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quoteId, email, orderType } = body ?? {};
    const customerEmail = String(email || '').trim().toLowerCase();

    if (!quoteId || !customerEmail || !orderType) {
      return NextResponse.json(
        { error: 'quoteId, email and orderType are required' },
        { status: 400 }
      );
    }

    await createQuoteNotification(quoteId, email, orderType);

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromAddress = process.env.EMAIL_FROM || smtpUser;
    const adminRecipients = process.env.ADMIN_EMAILS?.split(',')
      .map((recipient) => recipient.trim())
      .filter(Boolean) || [];

    if (smtpHost && smtpPort && smtpUser && smtpPass && fromAddress) {
      const allowSelfSigned = process.env.SMTP_ALLOW_SELF_SIGNED_CERTS === 'true';

      const sendMessage = async (allowRelaxedTls: boolean) => {
        const transport = createTransport(smtpHost, smtpPort, smtpUser, smtpPass, allowRelaxedTls);

        if (adminRecipients.length > 0) {
          await transport.sendMail({
            from: fromAddress,
            to: adminRecipients,
            subject: 'New quote request received',
            text: `A new ${orderType} quote request was submitted by ${customerEmail}. Quote ID: ${quoteId}.`,
            html: `
              <p>A new <strong>${orderType}</strong> quote request was submitted.</p>
              <p><strong>Customer email:</strong> ${customerEmail}</p>
              <p><strong>Quote ID:</strong> ${quoteId}</p>
            `,
          });
        }

        await transport.sendMail({
          from: fromAddress,
          to: customerEmail,
          subject: 'We received your quote request',
          text: `Thanks for your ${orderType} quote request. We have received your submission and will contact you soon. Your quote ID is ${quoteId}.`,
          html: `
            <p>Thanks for your <strong>${orderType}</strong> quote request.</p>
            <p>We have received your submission and will contact you soon.</p>
            <p><strong>Your quote ID:</strong> ${quoteId}</p>
          `,
        });
      };

      try {
        await sendMessage(allowSelfSigned);
      } catch (mailError: unknown) {
        const message = mailError instanceof Error ? mailError.message : '';
        if (message.toLowerCase().includes('self-signed certificate')) {
          try {
            await sendMessage(true);
          } catch (retryError) {
            console.error('Quote notification email failed after TLS retry:', retryError);
          }
        } else {
          console.error('Quote notification email failed:', mailError);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('quote notify failed:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

