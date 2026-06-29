import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';
import { createContactNotification } from '@/lib/notificationHelper';

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

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Contact form error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'Failed to submit contact form.' }, { status: 500 });
  }
}

