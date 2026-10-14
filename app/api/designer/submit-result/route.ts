import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';
import { adminFirestore, adminStorageBucket } from '@/lib/firebaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const ADMIN_NOTIFICATION_EMAIL = 'ahdigitizing@gmail.com';
const MAX_FILE_SIZE = 50 * 1024 * 1024;

function verifySessionToken(token?: string | null) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { id?: string; email?: string; role?: string };
  } catch {
    return null;
  }
}

async function notifyAdminOfSubmission({
  orderNumber,
  orderType,
  designerName,
  designerEmail,
  files,
}: {
  orderNumber: string;
  orderType: string;
  designerName: string;
  designerEmail: string;
  files: Array<{ fileName: string; downloadURL: string }>;
}) {
  const smtpHost = process.env.DESIGNER_SMTP_HOST || process.env.SMTP_HOST;
  const smtpPort = process.env.DESIGNER_SMTP_PORT || process.env.SMTP_PORT;
  const smtpUser = process.env.DESIGNER_SMTP_USER || process.env.SMTP_USER;
  const smtpPass = process.env.DESIGNER_SMTP_PASS || process.env.SMTP_PASS;
  const fromAddress = process.env.DESIGNER_EMAIL_FROM || process.env.EMAIL_FROM || smtpUser;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromAddress) {
    throw new Error('SMTP email settings are not configured.');
  }

  const secure = (process.env.DESIGNER_SMTP_SECURE ?? process.env.SMTP_SECURE) === 'true';
  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure,
    requireTLS: !secure,
    tls: { rejectUnauthorized: process.env.SMTP_ALLOW_SELF_SIGNED_CERTS !== 'true' },
    auth: { user: smtpUser, pass: smtpPass },
  });

  const fileListText = files.map((file) => `- ${file.fileName}: ${file.downloadURL}`).join('\n');
  const fileListHtml = files
    .map((file) => `<li><a href="${file.downloadURL}">${escapeHtml(file.fileName)}</a></li>`)
    .join('');

  await transport.sendMail({
    from: fromAddress,
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `Design submitted: ${orderNumber} (${orderType})`,
    text: `${designerName}${designerEmail ? ` (${designerEmail})` : ''} has submitted the design for ${orderType} Order No ${orderNumber}.\n\nFiles:\n${fileListText}`,
    html: `<p><strong>${escapeHtml(designerName)}</strong>${designerEmail ? ` (${escapeHtml(designerEmail)})` : ''} has submitted the design for <strong>${escapeHtml(orderType)}</strong> Order No <strong>${escapeHtml(orderNumber)}</strong>.</p><p>Files:</p><ul>${fileListHtml}</ul>`,
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string);
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value;
    const payload = verifySessionToken(token);

    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (payload.role !== 'designer' && payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!adminFirestore || !adminStorageBucket) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const formData = await req.formData();
    const source = String(formData.get('source') || '');
    const id = String(formData.get('id') || '');
    const files = formData.getAll('files').filter((entry): entry is File => entry instanceof File);

    if ((source !== 'quotes' && source !== 'quoteRequests') || !id) {
      return NextResponse.json({ error: 'source and id are required.' }, { status: 400 });
    }
    if (files.length === 0) {
      return NextResponse.json({ error: 'At least one file is required.' }, { status: 400 });
    }
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File "${file.name}" exceeds the 50 MB limit.` }, { status: 400 });
      }
    }

    const docRef = adminFirestore.collection(source).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const docData = docSnap.data() || {};
    const isAssignedDesigner =
      docData.assignedDesignerId === payload.id ||
      (payload.email && docData.assignedDesignerEmail === payload.email);

    if (payload.role !== 'admin' && !isAssignedDesigner) {
      return NextResponse.json({ error: 'This order is not assigned to you.' }, { status: 403 });
    }

    const bucket = adminStorageBucket;
    const submittedAt = new Date().toISOString();
    const submissionFiles = await Promise.all(
      files.map(async (file, index) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
        const storagePath = `designer-submissions/${source}/${id}/${Date.now()}-${index + 1}-${safeName}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const downloadToken = randomUUID();
        const storageFile = bucket.file(storagePath);

        await storageFile.save(buffer, {
          metadata: {
            contentType: file.type || 'application/octet-stream',
            metadata: { firebaseStorageDownloadTokens: downloadToken },
          },
        });

        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;

        return {
          fileName: file.name,
          storagePath,
          downloadURL,
          size: file.size,
          type: file.type,
        };
      })
    );

    const [firstFile] = submissionFiles;

    await docRef.update({
      designerSubmission: {
        fileName: firstFile.fileName,
        storagePath: firstFile.storagePath,
        downloadURL: firstFile.downloadURL,
        submittedAt,
        submittedById: payload.id,
        submittedByEmail: payload.email || null,
      },
      designerSubmissionFiles: submissionFiles,
      designerSubmissionUrl: firstFile.downloadURL,
      designerSubmissionPath: firstFile.storagePath,
      designerSubmittedAt: submittedAt,
      status: 'Received',
    });

    try {
      await notifyAdminOfSubmission({
        orderNumber: String(docData.orderNumber || id),
        orderType: source === 'quoteRequests' ? 'Quote' : String(docData.orderType || 'Order'),
        designerName: String(docData.assignedDesignerName || payload.email || 'Designer'),
        designerEmail: payload.email || String(docData.assignedDesignerEmail || ''),
        files: submissionFiles,
      });
    } catch (mailError) {
      // The upload already succeeded; a mail failure should not make the designer resubmit.
      console.error('Designer submission admin email error:', mailError);
    }

    return NextResponse.json({ ok: true, files: submissionFiles });
  } catch (err: unknown) {
    console.error('Designer submit-result error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
