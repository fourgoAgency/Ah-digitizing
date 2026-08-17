import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';
import { createContactNotification } from '@/lib/notificationHelper';
import nodemailer from 'nodemailer';

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
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const docRef = await adminFirestore.collection('contactMessages').add({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      subject: subject?.trim() || '',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      read: false,
    });

    // Create notification for admin
    await createContactNotification(name, email, subject || 'No subject');

    // Send email notification
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromAddress = process.env.EMAIL_FROM || smtpUser;
    const adminEmail = process.env.ADMIN_EMAIL || 'ahdigitizing@gmail.com';

    if (smtpHost && smtpPort && smtpUser && smtpPass && fromAddress) {
      const allowSelfSigned = process.env.SMTP_ALLOW_SELF_SIGNED_CERTS === 'true';

      const sendMessage = async (allowRelaxedTls: boolean) => {
        const transport = createTransport(smtpHost, smtpPort, smtpUser, smtpPass, allowRelaxedTls);

        // Send email to admin with CC
        await transport.sendMail({
          from: fromAddress,
          to: adminEmail,
          cc: 'ahdigitizing@gmail.com',
          subject: `New Contact Form Submission: ${subject || 'No subject'}`,
          text: `
New contact form submission received:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject || 'No subject'}

Message:
${message}
          `,
          html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
<p><strong>Subject:</strong> ${subject || 'No subject'}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });
      };

      try {
        await sendMessage(allowSelfSigned);
      } catch (mailError: unknown) {
        const message = mailError instanceof Error ? mailError.message : '';
        if (!message.toLowerCase().includes('self-signed certificate')) {
          throw mailError;
        }
        await sendMessage(true);
      }
    }

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Contact form error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'Failed to submit contact form.' }, { status: 500 });
  }
}

