'use client';

import JSZip from 'jszip';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { CheckCircle2, Clock3, Download, Paperclip, UploadCloud } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { firestore, uploadFile, updateDocument } from '@/lib/firebase';

type QuoteDoc = Record<string, unknown> & { id: string; source: 'quotes' | 'quoteRequests' };

type AssignedItem = {
  id: string;
  source: 'quotes' | 'quoteRequests';
  title: string;
  client: string;
  email: string;
  orderType: string;
  status: string;
  assignedAt: Date | null;
  deadline: string;
  document: QuoteDoc;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function getString(document: Record<string, unknown>, keys: string[], fallback = '') {
  for (const key of keys) {
    const value = document[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return fallback;
}

function getDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const record = asRecord(value);
  if (record && typeof record.toDate === 'function') {
    const date = record.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
  }

  return null;
}

function formatDateTime(date: Date | null) {
  if (!date) return 'Not set';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getSubmissionInfo(document: Record<string, unknown>) {
  const submission = asRecord(document.designerSubmission) ?? asRecord(document.submission) ?? null;
  const directUrl = getString(document, ['designerSubmissionUrl', 'submissionUrl', 'resultUrl', 'downloadURL', 'downloadUrl']);
  const directPath = getString(document, ['designerSubmissionPath', 'submissionPath', 'resultPath', 'storagePath']);
  const fileName = getString(document, ['designerSubmissionName', 'submissionName', 'resultName']);

  return {
    submission,
    url: directUrl || getString(submission ?? {}, ['downloadURL', 'downloadUrl', 'url', 'fileUrl', 'storageUrl']),
    path: directPath || getString(submission ?? {}, ['storagePath', 'path']),
    fileName: fileName || getString(submission ?? {}, ['name', 'fileName', 'title']),
    submittedAt: getDate(document.designerSubmittedAt) || getDate(document.submittedAt) || getDate(submission?.submittedAt),
  };
}

type QuoteFileEntry = {
  name: string;
  url: string;
};

function collectQuoteFiles(document: Record<string, unknown>): QuoteFileEntry[] {
  const candidateKeys = [
    'files',
    'attachments',
    'uploads',
    'referenceFiles',
    'designFiles',
    'sourceFiles',
  ];

  const results: QuoteFileEntry[] = [];

  for (const key of candidateKeys) {
    const value = document[key];
    if (!Array.isArray(value)) continue;

    value.forEach((item, index) => {
      const record = asRecord(item);
      const url =
        (typeof item === 'string' ? item : '') ||
        getString(record ?? {}, ['downloadURL', 'downloadUrl', 'url', 'storageUrl', 'fileUrl', 'path']);
      if (!url) return;

      const name =
        getString(record ?? {}, ['name', 'fileName', 'title']) ||
        `${key}-${index + 1}`;

      results.push({ name, url });
    });
  }

  return results;
}

function isPreviewableImage(url: string) {
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(url);
}

function buildQuoteDetailsText(item: AssignedItem) {
  const document = item.document;
  const submission = getSubmissionInfo(document);
  const files = collectQuoteFiles(document);
  const fields: Array<[string, string]> = [
    ['Quote ID', item.id],
    ['Source', item.source],
    ['Client', item.client],
    ['Email', item.email || ''],
    ['Order type', item.orderType],
    ['Status', item.status],
    ['Assigned at', formatDateTime(item.assignedAt)],
    ['Deadline', item.deadline || 'Not set'],
    ['Submission URL', submission.url || 'Not submitted'],
    ['Submission file', submission.fileName || 'Not submitted'],
    ['Submission time', formatDateTime(submission.submittedAt)],
    ['Assigned by designer', getString(document, ['assignedDesignerName'], 'Not provided')],
    ['Assigned designer email', getString(document, ['assignedDesignerEmail'], 'Not provided')],
  ];

  const extraFields = Object.entries(document)
    .filter(([key]) => ![
      'id',
      'source',
      'files',
      'attachments',
      'uploads',
      'referenceFiles',
      'designFiles',
      'sourceFiles',
      'designerSubmission',
      'submission',
    ].includes(key))
    .filter(([, value]) => value !== null && value !== undefined && value !== '');

  const lines = [
    'Designer Quote Details',
    '======================',
    '',
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'Source Files',
    '============',
    ...(files.length > 0 ? files.map((file) => `- ${file.name} (${file.url})`) : ['- None found']),
    '',
    'Additional Fields',
    '=================',
    ...(extraFields.length > 0
      ? extraFields.map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
      : ['- None']),
  ];

  return lines.join('\n');
}

async function fetchFileAsBlob(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
  }
  return await response.blob();
}

export default function DesignerPage() {
  const { customUser } = useAuth();
  const [assigned, setAssigned] = useState<AssignedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<AssignedItem | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customUser?.id && !customUser?.email) return;

    const listeners = [
      { source: 'quotes' as const, query: query(collection(firestore, 'quotes'), where('assignedDesignerId', '==', customUser.id)) },
      { source: 'quoteRequests' as const, query: query(collection(firestore, 'quoteRequests'), where('assignedDesignerId', '==', customUser.id)) },
      { source: 'quotes' as const, query: query(collection(firestore, 'quotes'), where('assignedDesignerEmail', '==', customUser.email)) },
      { source: 'quoteRequests' as const, query: query(collection(firestore, 'quoteRequests'), where('assignedDesignerEmail', '==', customUser.email)) },
    ];

    const seen = new Map<string, AssignedItem>();

    const unsubscribeFns = listeners.map(({ source, query: assignedQuery }) =>
      onSnapshot(
        assignedQuery,
        (snapshot) => {
          snapshot.docs.forEach((document) => {
            const data = { ...document.data(), id: document.id } as Record<string, unknown>;
            const itemId = `${source}:${document.id}`;
            const item: AssignedItem = {
              id: document.id,
              source,
              title: getString(data, ['subject', 'title', 'orderType', 'serviceType'], 'Assigned quote'),
              client: getString(data, ['fullName', 'name', 'customerName', 'clientName'], 'Customer'),
              email: getString(data, ['email', 'customerEmail', 'contactEmail'], ''),
              orderType: getString(data, ['orderType', 'serviceType', 'type'], 'Quote'),
              status: getString(data, ['status'], 'Assigned to Designer'),
              assignedAt: getDate(data.assignedAt),
              deadline: getString(data, ['submissionDeadline', 'deadline'], ''),
              document: { ...data, source } as QuoteDoc,
            };
            seen.set(itemId, item);
          });
          setAssigned(Array.from(seen.values()).sort((a, b) => (b.assignedAt?.getTime() || 0) - (a.assignedAt?.getTime() || 0)));
          setLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message);
          setLoading(false);
        }
      )
    );

    return () => {
      unsubscribeFns.forEach((unsubscribe) => unsubscribe());
    };
  }, [customUser?.email, customUser?.id]);

  const activeItem = useMemo(() => selectedItem, [selectedItem]);

  const stats = useMemo(() => {
    const total = assigned.length;
    const submitted = assigned.filter((item) => getSubmissionInfo(item.document).url).length;
    const pending = total - submitted;
    return { total, submitted, pending };
  }, [assigned]);

  const activeQuoteFiles = useMemo(() => (activeItem ? collectQuoteFiles(activeItem.document) : []), [activeItem]);

  async function handleSubmitResult() {
    if (!activeItem || !selectedFile) return;

    setUploadingId(activeItem.source + ':' + activeItem.id);
    setError(null);
    setMessage(null);

    try {
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
      const storagePath = `designer-submissions/${activeItem.source}/${activeItem.id}/${Date.now()}-${safeName}`;
      const downloadURL = await uploadFile(selectedFile, storagePath);
      const submittedAt = new Date().toISOString();

      await updateDocument(activeItem.source, activeItem.id, {
        designerSubmission: {
          fileName: selectedFile.name,
          storagePath,
          downloadURL,
          submittedAt,
          submittedById: customUser?.id || null,
          submittedByEmail: customUser?.email || null,
        },
        designerSubmissionUrl: downloadURL,
        designerSubmissionPath: storagePath,
        designerSubmittedAt: submittedAt,
        status: 'Completed',
      });

      setMessage('Submission uploaded successfully.');
      setSelectedItem(null);
      setSelectedFile(null);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to upload submission.');
    } finally {
      setUploadingId(null);
    }
  }

  async function handleDownloadZip() {
    if (!activeItem) return;

    setDownloadingZip(true);
    setError(null);

    try {
      const zip = new JSZip();
      const detailsText = buildQuoteDetailsText(activeItem);
      zip.file('details.txt', detailsText);

      const sourceFiles = collectQuoteFiles(activeItem.document);
      if (sourceFiles.length === 0) {
        zip.file('README.txt', 'No uploaded source files were found for this quote.');
      } else {
        const folder = zip.folder('uploaded-files');
        if (!folder) throw new Error('Unable to create zip folder.');

        for (const file of sourceFiles) {
          const blob = await fetchFileAsBlob(file.url);
          folder.file(file.name, blob);
        }
      }

      const archive = await zip.generateAsync({ type: 'blob' });
      const objectUrl = URL.createObjectURL(archive);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `${activeItem.id.slice(0, 8).toUpperCase()}-${activeItem.source}-package.zip`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch (zipError) {
      setError(zipError instanceof Error ? zipError.message : 'Unable to create ZIP download.');
    } finally {
      setDownloadingZip(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Designer workspace</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">Assigned quotes</h1>
            <p className="mt-1 text-sm text-slate-600">Upload the finished artwork or embroidery file when you are done.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Assigned" value={stats.total} />
            <Stat label="Submitted" value={stats.submitted} />
            <Stat label="Pending" value={stats.pending} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}
        {message ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
        ) : null}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Your queue</h2>
              <p className="mt-1 text-sm text-slate-600">Only quotes assigned to your account appear here.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock3 className="h-4 w-4" />
              {loading ? 'Loading...' : `${assigned.length} item${assigned.length === 1 ? '' : 's'}`}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Quote</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Deadline</th>
                  <th className="px-5 py-3">Submission</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td className="px-5 py-16 text-center text-sm text-slate-500" colSpan={6}>
                      Loading assigned quotes...
                    </td>
                  </tr>
                ) : assigned.length === 0 ? (
                  <tr>
                    <td className="px-5 py-16 text-center text-sm text-slate-500" colSpan={6}>
                      No assigned quotes yet.
                    </td>
                  </tr>
                ) : (
                  assigned.map((item) => {
                    const submission = getSubmissionInfo(item.document);
                    const key = `${item.source}:${item.id}`;
                    return (
                      <tr key={key} className="text-sm text-slate-700">
                        <td className="px-5 py-4 font-medium text-slate-950">{item.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-950">{item.client}</div>
                          <div className="text-xs text-slate-500">{item.email || 'No email provided'}</div>
                        </td>
                        <td className="px-5 py-4">{item.orderType}</td>
                        <td className="px-5 py-4">{item.deadline || 'Not set'}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              submission.url ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {submission.url ? 'Submitted' : 'Waiting for upload'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                          >
                            <UploadCloud className="h-4 w-4" />
                            Submit result
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {activeItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Submit result</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">{activeItem.title}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Upload the final file for {activeItem.client}. When submitted, this quote will be marked completed.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  disabled={downloadingZip}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  {downloadingZip ? 'Preparing ZIP...' : 'Download ZIP'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    setSelectedFile(null);
                  }}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
                >
                  <Paperclip className="h-4 w-4 rotate-45" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-78px)] overflow-y-auto px-5 py-5">
              <section className="mt-6 rounded-md border border-slate-100 bg-slate-50 p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">Quote Detail</h4>
                    <p className="mt-1 text-xs text-slate-500">This shows the design/job details attached to the assigned quote.</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {detailRows(activeItem.document).map(([label, value]) => (
                    <div key={label} className="rounded-md border border-slate-200 bg-white px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">{label}</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-6 rounded-md border border-slate-100 bg-slate-50 p-4">
                <h4 className="text-sm font-bold text-slate-950">Files</h4>
                <div className="mt-3 space-y-2">
                  {activeQuoteFiles.length > 0 ? activeQuoteFiles.map((file) => (
                    <div key={`${file.name}-${file.url}`} className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{file.name}</span>
                        <a href={file.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 underline">
                          Open file
                        </a>
                      </div>
                      {isPreviewableImage(file.url) ? (
                        <Image
                          src={file.url}
                          alt={file.name}
                          width={800}
                          height={320}
                          unoptimized
                          className="mt-2 h-auto max-h-40 w-full rounded object-contain"
                        />
                      ) : null}
                    </div>
                  )) : <p className="text-sm text-slate-500">No uploaded source files found.</p>}
                </div>
              </section>

              <label className="block rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                />
                <UploadCloud className="mx-auto h-8 w-8 text-slate-500" />
                <p className="mt-3 text-sm font-medium text-slate-900">
                  {selectedFile ? selectedFile.name : 'Click to choose a file to upload'}
                </p>
                <p className="mt-1 text-xs text-slate-500">PDF, ZIP, PNG, AI, DST, PES, or any final deliverable file.</p>
              </label>

              {selectedFile ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500">{Math.ceil(selectedFile.size / 1024)} KB</span>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    setSelectedFile(null);
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedFile || uploadingId === `${activeItem.source}:${activeItem.id}`}
                  onClick={handleSubmitResult}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {uploadingId === `${activeItem.source}:${activeItem.id}` ? 'Uploading...' : 'Upload submission'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
      <div className="text-2xl font-bold text-slate-950">{value}</div>
      <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{label}</div>
    </div>
  );
}

function detailRows(document: Record<string, unknown>) {
  return [
    ['Design name', getString(document, ['designName', 'design_name', 'title', 'subject', 'orderType'], 'Not provided')],
    ['Turnaround time', getString(document, ['turnaroundTime', 'turnaround', 'submissionDeadline', 'deadline'], 'Not provided')],
    ['Output formats', getString(document, ['outcomeFileType', 'fileType', 'outputType', 'deliverableType', 'formats'], 'Not provided')],
    ['Additional notes', getString(document, ['additionalNotes', 'notes', 'instructions', 'remarks'], 'Not provided')],
  ];
}
