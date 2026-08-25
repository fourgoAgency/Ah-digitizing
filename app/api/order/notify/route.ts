import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebaseAdmin';
import { createOrderNotification, createDesignerAssignmentNotification, createOrderCompletionNotification } from '@/lib/notificationHelper';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

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
      const orderSnapshot = await adminFirestore.collection('orders').doc(orderId).get();
      if (!orderSnapshot.exists) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      const order = orderSnapshot.data() || {};
      const deliveryEmail = order.deliveryEmail || order.customerEmail || order.email || customerEmail;
      if (!deliveryEmail) return NextResponse.json({ error: 'Delivery email not found.' }, { status: 400 });
      await createOrderCompletionNotification(orderId, deliveryEmail);

      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const fromAddress = process.env.EMAIL_FROM || smtpUser;
      if (smtpHost && smtpPort && smtpUser && smtpPass && fromAddress && !order.deliveryEmailSentAt) {
        const items = Array.isArray(order.items) ? order.items : [];
        const itemLines = items.map((item: Record<string, unknown>) => {
          const product = item.product && typeof item.product === 'object' ? item.product as Record<string, unknown> : {};
          return `${item.title || item.name || product.title || product.name || 'Product'} x ${item.quantity || item.qty || 1}`;
        });
        const attachments = items.flatMap((item: Record<string, unknown>) => {
          const product = item.product && typeof item.product === 'object' ? item.product as Record<string, unknown> : {};
          const files = Array.isArray(item.outputFiles) ? item.outputFiles : Array.isArray(product.outputFiles) ? product.outputFiles : [];
          return files.filter((file): file is string => typeof file === 'string' && file.startsWith('http')).map((path) => ({ path, filename: path.split('/').pop()?.split('?')[0] || 'output-file' }));
        });
        const sendDeliveryEmail = async (allowSelfSigned: boolean, port: number, secure: boolean) => {
          const transportOptions = {
            host: smtpHost,
            port,
            secure,
            family: 4,
            requireTLS: !secure,
            tls: { rejectUnauthorized: !allowSelfSigned },
            auth: { user: smtpUser, pass: smtpPass },
          } as SMTPTransport.Options & { family: number };
          const transport = nodemailer.createTransport(transportOptions);
          await transport.sendMail({
            from: fromAddress,
            to: deliveryEmail,
            subject: `Your order ${order.orderNo || orderId} is completed`,
            text: `Your order ${order.orderNo || orderId} is completed.\n\nPlease check the relevant files attached to this email.\n\nOrder items:\n${itemLines.join('\n') || 'No items listed.'}\n\nThank you for your order.`,
            attachments,
          });
        };
        try {
          const configuredPort = Number(smtpPort);
          await sendDeliveryEmail(process.env.SMTP_ALLOW_SELF_SIGNED_CERTS === 'true', configuredPort, process.env.SMTP_SECURE === 'true');
        } catch (mailError: unknown) {
          const message = mailError instanceof Error ? mailError.message : '';
          const configuredPort = Number(smtpPort);
          const isConnectionFailure = /ECONNREFUSED|ETIMEDOUT|ESOCKET/i.test(message);
          const isCertificateFailure = message.toLowerCase().includes('certificate');
          if (isConnectionFailure && configuredPort === 465) {
            await sendDeliveryEmail(true, 587, false);
          } else if (isCertificateFailure) {
            await sendDeliveryEmail(true, configuredPort, process.env.SMTP_SECURE === 'true');
          } else {
            throw mailError;
          }
        }
        await adminFirestore.collection('orders').doc(orderId).update({ deliveryEmailSentAt: new Date().toISOString() });
      }
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

