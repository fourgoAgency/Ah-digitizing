import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';
import { createReviewNotification } from '@/lib/notificationHelper';

export async function POST(req: Request) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { productName, rating, reviewText, customerEmail } = body;

    if (!productName || !rating) {
      return NextResponse.json({ error: 'Product name and rating are required.' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }

    const docRef = await adminFirestore.collection('reviews').add({
      productName: productName.trim(),
      rating: Number(rating),
      reviewText: reviewText?.trim() || '',
      customerEmail: customerEmail?.trim() || '',
      submittedAt: new Date().toISOString(),
      approved: false,
    });

    // Create notification
    await createReviewNotification(productName, rating);

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (error: unknown) {
    console.error('Review submission error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'Failed to submit review.' }, { status: 500 });
    }
}

