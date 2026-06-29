import { NextResponse } from 'next/server';
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

export async function GET(req: Request) {
  try {
    if (!adminFirestore) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

    // check admin_session cookie
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )admin_session=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    const admin = verifyAdminToken(token);
    if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

    const url = new URL(req.url);
    const q = url.searchParams.get('q')?.toLowerCase() || '';
    const role = url.searchParams.get('role')?.toLowerCase() || '';

    const snapshot = await adminFirestore.collection('users').get();
    const users: Array<Record<string, unknown> & { id: string }> = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const userRole = (data.role || 'user').toString().toLowerCase();
      if (role && userRole !== role) return;
      const entry = { id: doc.id, ...data };
      if (!q) users.push(entry);
      else {
        const email = (data.email || '').toString().toLowerCase();
        const name = (data.displayName || data.name || '').toString().toLowerCase();
        if (email.includes(q) || name.includes(q) || doc.id.includes(q)) users.push(entry);
      }
    });

    return NextResponse.json({ ok: true, users });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
