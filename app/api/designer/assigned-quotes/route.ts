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
    let completedCount = 0;
    const completedBreakdown = {
      orderTypes: { Embroidery: 0, Vector: 0, Quote: 0 },
      turnaround: { Standard: 0, Rush: 0, 'Super Rush': 0 },
    };

    const getCompletedOrderType = (data: Record<string, unknown>, source: 'quotes' | 'quoteRequests') => {
      if (source === 'quoteRequests') return 'Quote' as const;
      const value = String(data.orderType || data.serviceType || data.type || '').toLowerCase();
      if (value.includes('embroidery')) return 'Embroidery' as const;
      if (value.includes('vector')) return 'Vector' as const;
      return 'Quote' as const;
    };

    const getCompletedTurnaround = (data: Record<string, unknown>) => {
      const value = String(data.assignmentType || data.turnaroundTime || '').toLowerCase();
      if (value.includes('super rush')) return 'Super Rush' as const;
      if (value.includes('rush')) return 'Rush' as const;
      return 'Standard' as const;
    };

    const isCompleted = (data: Record<string, unknown>) => {
      const status = String(data.status || '').trim().toLowerCase();
      return status.includes('completed') || status.includes('received');
    };

    [quotesByIdSnap, quotesByEmailSnap].forEach((snap) => {
      snap.docs.forEach((doc) => {
        if (!seen.has(doc.id)) {
          seen.add(doc.id);
          const data = doc.data();
          if (isCompleted(data)) {
            completedCount += 1;
            completedBreakdown.orderTypes[getCompletedOrderType(data, 'quotes')] += 1;
            completedBreakdown.turnaround[getCompletedTurnaround(data)] += 1;
          }
          else assigned.push({ id: doc.id, source: 'quotes', ...data });
        }
      });
    });

    [quoteReqsByIdSnap, quoteReqsByEmailSnap].forEach((snap) => {
      snap.docs.forEach((doc) => {
        if (!seen.has(doc.id)) {
          seen.add(doc.id);
          const data = doc.data();
          if (isCompleted(data)) {
            completedCount += 1;
            completedBreakdown.orderTypes[getCompletedOrderType(data, 'quoteRequests')] += 1;
            completedBreakdown.turnaround[getCompletedTurnaround(data)] += 1;
          }
          else assigned.push({ id: doc.id, source: 'quoteRequests', ...data });
        }
      });
    });

    return NextResponse.json({ assigned, completedCount, completedBreakdown });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
