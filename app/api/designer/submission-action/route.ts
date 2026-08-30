import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ActionPayload = {
  action?: 'need_changes' | 'send_to_customer';
  customerEmail?: string;
  designerEmail?: string;
  designerName?: string;
  quoteId?: string;
  orderNumber?: string;
  orderType?: string;
  submissionUrl?: string;
  submissionFileName?: string;
};

function createTransport() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: process.env.SMTP_SECURE === 'true',
    tls: {
      rejectUnauthorized: process.env.SMTP_ALLOW_SELF_SIGNED_CERTS === 'true' ? false : true,
    },
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

async function fetchAttachment(url?: string, fileName?: string) {
  if (!url) return null;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch submission file: ${response.status} ${response.statusText}`);

  const arrayBuffer = await response.arrayBuffer();
  return {
    filename: fileName || 'submission-file',
    content: Buffer.from(arrayBuffer),
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ActionPayload;
    const action = body.action;
    const quoteId = String(body.quoteId || '').trim();
    const orderNumber = String(body.orderNumber || '').trim();
    const orderType = String(body.orderType || '').trim();

    if (!action || !quoteId || !orderNumber || !orderType) {
      return NextResponse.json({ error: 'action, quoteId, orderNumber and orderType are required.' }, { status: 400 });
    }

    const transport = createTransport();
    if (!transport) {
      return NextResponse.json({ error: 'SMTP email settings are not configured.' }, { status: 500 });
    }

    const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER;
    if (!fromAddress) {
      return NextResponse.json({ error: 'EMAIL_FROM is not configured.' }, { status: 500 });
    }

    if (action === 'need_changes') {
      const designerEmail = String(body.designerEmail || '').trim().toLowerCase();
      const designerName = String(body.designerName || '').trim() || 'Designer';
      if (!designerEmail) {
        return NextResponse.json({ error: 'designerEmail is required for need_changes.' }, { status: 400 });
      }

      await transport.sendMail({
        from: fromAddress,
        to: designerEmail,
        subject: `Changes required for ${orderType} quote ${orderNumber}`,
        text: `Hi ${designerName}, changes are required for Order No ${orderNumber} (${orderType}). Please review and resubmit.`,
        html: `<p>Hi <strong>${designerName}</strong>,</p><p>Changes are required for Order No <strong>${orderNumber}</strong> (${orderType}). Please review and resubmit.</p>`,
      });

      return NextResponse.json({ ok: true });
    }

    if (action === 'send_to_customer') {
      const customerEmail = String(body.customerEmail || '').trim().toLowerCase();
      const submissionUrl = String(body.submissionUrl || '').trim();
      const submissionFileName = String(body.submissionFileName || '').trim();
      if (!customerEmail || !submissionUrl) {
        return NextResponse.json({ error: 'customerEmail and submissionUrl are required for send_to_customer.' }, { status: 400 });
      }

      const attachment = await fetchAttachment(submissionUrl, submissionFileName || `${orderNumber}-submission`);

      await transport.sendMail({
        from: fromAddress,
        to: customerEmail,
        subject: `Your completed ${orderType} file is ready`,
        text: `Your ${orderType} quote ${orderNumber} is completed. Please find the finished file attached.`,
        html: `<p>Your <strong>${orderType}</strong> quote <strong>${orderNumber}</strong> is completed.</p><p>Please find the finished file attached.</p>`,
        attachments: attachment ? [attachment] : [],
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: unknown) {
    console.error('Designer submission action error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
