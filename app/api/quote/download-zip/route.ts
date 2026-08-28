import JSZip from 'jszip';
import { NextResponse } from 'next/server';

type ZipFile = {
  name?: unknown;
  url?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const files = Array.isArray(body?.files) ? (body.files as ZipFile[]) : [];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files were provided.' }, { status: 400 });
    }

    const zip = new JSZip();
    let addedFiles = 0;

    for (const [index, file] of files.entries()) {
      const url = typeof file.url === 'string' ? file.url : '';
      if (!url) continue;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Unable to fetch file: ${response.status} ${response.statusText}`);
      }

      const name = typeof file.name === 'string' && file.name.trim()
        ? file.name.trim()
        : `file-${index + 1}`;
      zip.file(name, await response.arrayBuffer());
      addedFiles += 1;
    }

    if (addedFiles === 0) {
      return NextResponse.json({ error: 'No downloadable files were found.' }, { status: 400 });
    }

    const archive = await zip.generateAsync({ type: 'arraybuffer' });
    return new Response(archive, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${String(body?.orderId || 'quote')}.zip"`,
      },
    });
  } catch (error) {
    console.error('Quote ZIP download failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create ZIP download.' },
      { status: 500 }
    );
  }
}
