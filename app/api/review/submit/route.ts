import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';
import { createReviewNotification } from '@/lib/notificationHelper';
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
    const { name, email, country, review } = body;

    if (!name || !email || !country || !review) {
      return NextResponse.json({ error: 'Name, email, country, and review are required.' }, { status: 400 });
    }

    const docRef = await adminFirestore.collection('reviews').add({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      country: country.trim(),
      review: review.trim(),
      submittedAt: new Date().toISOString(),
      approved: false,
    });

    // Create notification for admin
    await createReviewNotification('AH Digitizing Service', 5); // Default rating, can be extended later

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
          subject: 'New Review Submitted',
          text: `
New review submitted:

Name: ${name}
Email: ${email}
Country: ${country}

Review:
${review}
          `,
          html: `
<h2>New Review Submitted</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Country:</strong> ${country}</p>
<p><strong>Review:</strong></p>
<p>${review.replace(/\n/g, '<br>')}</p>
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
    console.error('Review submission error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'Failed to submit review.' }, { status: 500 });
  }
}