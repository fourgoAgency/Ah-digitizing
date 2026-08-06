import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import admin, { adminFirestore } from '@/lib/firebaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

function verifyAdminToken(token?: string | null) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { admin?: boolean };
    if (decoded.admin) return decoded;
    return null;
  } catch {
    return null;
  }
}

const CATEGORIES = ['embroidery', 'vector'] as const;

/**
 * Appends uploaded portfolio storage URLs to the Firestore `portfolioIndex/<category>`
 * doc so the public site (lib/portfolioIndex.ts) can list them.
 */
export async function POST(req: NextRequest) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )admin_session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    const adminUser = verifyAdminToken(token);
    if (!adminUser) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

    const body = await req.json();
    const { category, urls } = body;

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    if (
      !Array.isArray(urls) ||
      urls.length === 0 ||
      !urls.every((u) => typeof u === 'string' && u.length > 0)
    ) {
      return NextResponse.json(
        { error: 'urls must be a non-empty array of strings' },
        { status: 400 }
      );
    }

    await adminFirestore
      .collection('portfolioIndex')
      .doc(category)
      .set(
        {
          urls: admin.firestore.FieldValue.arrayUnion(...urls),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return NextResponse.json({ ok: true, count: urls.length });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
