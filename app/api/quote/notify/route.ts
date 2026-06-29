import { NextResponse } from 'next/server';

import { createQuoteNotification } from '@/lib/notificationHelper';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quoteId, email, orderType } = body ?? {};

    if (!quoteId || !email || !orderType) {
      return NextResponse.json(
        { error: 'quoteId, email and orderType are required' },
        { status: 400 }
      );
    }

    await createQuoteNotification(quoteId, email, orderType);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('quote notify failed:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

