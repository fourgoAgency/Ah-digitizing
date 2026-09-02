import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminFirestore } from '@/lib/firebaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

function verifySessionToken(token?: string | null) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { id?: string; email?: string; role?: string; admin?: boolean };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify session cookie (custom JWT or Firebase Auth admin)
    let token = req.cookies.get('session')?.value;
    let payload = verifySessionToken(token);
    
    // Try admin_session if no custom session
    if (!payload) {
      token = req.cookies.get('admin_session')?.value;
      payload = verifySessionToken(token);
    }

    // Check if user is admin
    if (!payload || (payload.role !== 'admin' && !payload.admin)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const { searchParams } = req.nextUrl;
    const collection = searchParams.get('collection') || 'orders';

    // Whitelist allowed collections for admins
    const allowedCollections = ['orders', 'quotes', 'quoteRequests', 'users', 'products', 'blogs', 'category', 'coupons', 'contactMessages', 'notifications', 'reviews', 'testimonials', 'pricing', 'portfolioIndex'];
    if (!allowedCollections.includes(collection)) {
      return NextResponse.json({ error: 'Collection not allowed' }, { status: 400 });
    }

    const snapshot = await adminFirestore.collection(collection).get();
    const documents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ documents }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
