import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';

type CouponData = {
  code?: string;
  discountValue?: string | number;
  type?: string;
  usage?: string | number;
  isActive?: boolean;
  status?: string;
  expiryDate?: FirebaseFirestore.Timestamp | Date | string;
};

function isExpired(expiryDate: CouponData['expiryDate']) {
  if (!expiryDate) return false;
  const expiry =
    typeof expiryDate === 'string'
      ? new Date(expiryDate)
      : 'toDate' in expiryDate
        ? expiryDate.toDate()
        : expiryDate;

  return Number.isFinite(expiry.getTime()) && new Date() > expiry;
}

function isActiveCoupon(data: CouponData) {
  if (data.isActive === false) return false;
  if (typeof data.status === 'string' && data.status.toLowerCase() !== 'active') return false;
  return !isExpired(data.expiryDate);
}

export async function POST(req: Request) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const { code } = await req.json();
    const normalizedCode = typeof code === 'string' ? code.trim() : '';
    if (!normalizedCode) {
      return NextResponse.json({ error: 'Missing coupon code' }, { status: 400 });
    }

    const snapshot = await adminFirestore
      .collection('coupons')
      .where('code', '==', normalizedCode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ coupon: null }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as CouponData;

    if (!isActiveCoupon(data)) {
      return NextResponse.json({ coupon: null }, { status: 404 });
    }

    return NextResponse.json({
      coupon: {
        id: doc.id,
        code: data.code,
        discountValue: data.discountValue,
        type: data.type,
        usage: data.usage ?? 0,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unable to validate coupon.' },
      { status: 500 }
    );
  }
}
