import { NextResponse } from 'next/server';
import admin, { adminFirestore } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const { couponId } = await req.json();
    if (typeof couponId !== 'string' || !couponId.trim()) {
      return NextResponse.json({ error: 'Missing coupon id' }, { status: 400 });
    }

    await adminFirestore
      .collection('coupons')
      .doc(couponId.trim())
      .update({
        usage: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unable to redeem coupon.' },
      { status: 500 }
    );
  }
}
