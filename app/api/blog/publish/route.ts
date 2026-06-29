import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';
import { createBlogNotification } from '@/lib/notificationHelper';

export async function POST(req: Request) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { title, author, content, slug } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required.' }, { status: 400 });
    }

    const docRef = await adminFirestore.collection('blogs').add({
      title: title.trim(),
      author: author?.trim() || 'Admin',
      slug: slug.trim(),
      content: content?.trim() || '',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Create notification
    await createBlogNotification(title, author);

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (error: unknown) {
    console.error('Blog publish error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'Failed to publish blog.' }, { status: 500 });
  }
}

