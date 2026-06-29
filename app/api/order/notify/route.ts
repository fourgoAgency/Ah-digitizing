import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';
import { createOrderNotification, createDesignerAssignmentNotification, createOrderCompletionNotification } from '@/lib/notificationHelper';

export async function POST(req: Request) {
  try {
    if (!adminFirestore) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { action, orderId, customerEmail, orderType, designerName } = body;

    if (!action || !orderId) {
      return NextResponse.json({ error: 'Action and orderId are required.' }, { status: 400 });
    }

    if (action === 'place') {
      if (!customerEmail || !orderType) {
        return NextResponse.json({ error: 'customerEmail and orderType required for place action.' }, { status: 400 });
      }
      await createOrderNotification(orderId, customerEmail, orderType);
    } else if (action === 'assign') {
      if (!designerName || !orderType) {
        return NextResponse.json({ error: 'designerName and orderType required for assign action.' }, { status: 400 });
      }
      await createDesignerAssignmentNotification(designerName, orderType);
    } else if (action === 'complete') {
      if (!customerEmail) {
        return NextResponse.json({ error: 'customerEmail required for complete action.' }, { status: 400 });
      }
      await createOrderCompletionNotification(orderId, customerEmail);
    } else {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('Order notification error:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage || 'Failed to create notification.' }, { status: 500 });
  }
}

