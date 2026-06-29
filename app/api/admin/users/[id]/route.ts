import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminFirestore } from '@/lib/firebaseAdmin';

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

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    if (!adminFirestore) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )admin_session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    const admin = verifyAdminToken(token);
    if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

    await adminFirestore.collection('users').doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
