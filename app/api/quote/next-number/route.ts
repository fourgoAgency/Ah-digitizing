import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';

const sequenceConfig = {
  quote: { collection: 'quoteSequence', prefix: 'OR' },
  freeQuote: { collection: 'freeQuoteSequence', prefix: 'FQ' },
} as const;

type SequenceName = keyof typeof sequenceConfig;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sequenceName = body?.sequenceName as SequenceName;
    const config = sequenceConfig[sequenceName];

    if (!config) {
      return NextResponse.json({ error: 'Invalid quote sequence.' }, { status: 400 });
    }
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Firebase Admin SDK is not configured.' }, { status: 500 });
    }

    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date()).toUpperCase();
    const sequenceRef = adminFirestore.collection('metadata').doc(config.collection);
    const nextValue = await adminFirestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(sequenceRef);
      const data = snapshot.exists ? snapshot.data() || {} : {};
      const currentValue = data.month === month ? Number(data.value) || 0 : 0;
      const value = currentValue + 1;
      transaction.set(sequenceRef, { month, value }, { merge: true });
      return value;
    });

    return NextResponse.json({ orderNumber: `${config.prefix}${month}${String(nextValue).padStart(4, '0')}` });
  } catch (error) {
    console.error('Quote number generation failed:', error);
    return NextResponse.json({ error: 'Unable to generate quote order number.' }, { status: 500 });
  }
}
