import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminFirestore } from '@/lib/firebaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

function verifySessionToken(token?: string | null) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { id?: string; email?: string; role?: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify session cookie
    const token = req.cookies.get('session')?.value;
    const payload = verifySessionToken(token);

    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // Fetch quotes assigned by ID and email
    const [quotesByIdSnap, quotesByEmailSnap, quoteReqsByIdSnap, quoteReqsByEmailSnap] = await Promise.all([
      adminFirestore.collection('quotes').where('assignedDesignerId', '==', payload.id).get(),
      adminFirestore.collection('quotes').where('assignedDesignerEmail', '==', payload.email).get(),
      adminFirestore.collection('quoteRequests').where('assignedDesignerId', '==', payload.id).get(),
      adminFirestore.collection('quoteRequests').where('assignedDesignerEmail', '==', payload.email).get(),
    ]);

    // Deduplicate by ID
    const seen = new Set<string>();
    const assigned: Array<{
      id: string;
      source: 'quotes' | 'quoteRequests';
      [key: string]: unknown;
    }> = [];

    [quotesByIdSnap, quotesByEmailSnap].forEach((snap) => {
      snap.docs.forEach((doc) => {
        if (!seen.has(doc.id)) {
          seen.add(doc.id);
          assigned.push({ id: doc.id, source: 'quotes', ...doc.data() });
        }
      });
    });

    [quoteReqsByIdSnap, quoteReqsByEmailSnap].forEach((snap) => {
      snap.docs.forEach((doc) => {
        if (!seen.has(doc.id)) {
          seen.add(doc.id);
          assigned.push({ id: doc.id, source: 'quoteRequests', ...doc.data() });
        }
      });
    });

    return NextResponse.json({ assigned });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
