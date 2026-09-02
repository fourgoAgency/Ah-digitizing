'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Download, UploadCloud } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { firestore, uploadFile, updateDocument } from '@/lib/firebase';

type QuoteDoc = Record<string, unknown> & { id: string; source: 'quotes' | 'quoteRequests' };

type AssignedItem = {
  id: string;
  orderNumber: string;
  source: 'quotes' | 'quoteRequests';
  orderType: string;
  assignmentType: string;
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

function formatDeadline(value: string) {
  const date = getDate(value);
  if (!date) return value || 'Not set';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date).replace(/\b(am|pm)\b/gi, (part) => part.toUpperCase()).replace(',', ' -');
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

function collectAssignmentFiles(document: Record<string, unknown>): QuoteFileEntry[] {
  const files = document.assignmentFiles;
  if (!Array.isArray(files)) return [];

  return files.flatMap((item, index) => {
    const record = asRecord(item);
    const url = getString(record ?? {}, ['downloadURL', 'downloadUrl', 'url', 'storageUrl', 'fileUrl', 'path']);
    if (!url) return [];
    return [{
      name: getString(record ?? {}, ['name', 'fileName', 'title'], `assignment-file-${index + 1}`),
      url,
    }];
  });
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

    async function fetchAssignedQuotes() {
      try {
        const res = await fetch('/api/designer/assigned-quotes', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch assigned quotes');
        const { assigned } = await res.json();
        
        const items: AssignedItem[] = assigned.map((doc: any) => ({
          id: doc.id,
          orderNumber: getString(doc, ['orderNumber'], 'Not Available'),
          source: doc.source as 'quotes' | 'quoteRequests',
          orderType: getString(doc, ['orderType', 'serviceType', 'type'], 'Quote'),
          assignmentType: getString(doc, ['assignmentType'], 'Standard'),
          status: getString(doc, ['status'], 'Assigned to Designer'),
          assignedAt: getDate(doc.assignedAt),
          deadline: getString(doc, ['submissionDeadline', 'deadline'], ''),
          document: { ...doc, source: doc.source } as QuoteDoc,
        }));
        
        setAssigned(items.sort((a, b) => (b.assignedAt?.getTime() || 0) - (a.assignedAt?.getTime() || 0)));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assigned quotes');
      } finally {
        setLoading(false);
      }
    }

    fetchAssignedQuotes();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchAssignedQuotes, 10000);
    
    return () => clearInterval(interval);
  }, [customUser?.email, customUser?.id]);

  const activeItem = useMemo(() => selectedItem, [selectedItem]);

  const stats = useMemo(() => {
    const total = assigned.length;
    const submitted = assigned.filter((item) => getSubmissionInfo(item.document).url).length;
    const pending = total - submitted;
    return { total, submitted, pending };
  }, [assigned]);

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
      const sourceFiles = collectAssignmentFiles(activeItem.document);
      if (sourceFiles.length === 0) throw new Error('No uploaded assignment file was found for this order.');
      const response = await fetch('/api/quote/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: activeItem.orderNumber, files: sourceFiles }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || 'Unable to create ZIP download.');
      const archive = await response.blob();
      const objectUrl = URL.createObjectURL(archive);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `${activeItem.orderNumber}.zip`;
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
                        <td className="px-5 py-4 font-medium text-slate-950">{item.orderNumber}</td>
                        <td className="px-5 py-4">{item.orderType}</td>
                        <td className="px-5 py-4">{formatDeadline(item.deadline)}</td>
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
                <h3 className="mt-1 text-xl font-bold text-slate-950">Order No: {activeItem.orderNumber}</h3>
                <p className="mt-1 text-sm text-slate-600">Upload the final file when the work is complete.</p>
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
                  className="rounded-full border border-slate-200 p-2 px-3 text-slate-500 transition hover:bg-slate-50"
                >
                  X
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-78px)] overflow-y-auto px-5 py-5">
              <section className="mt-6 rounded-md border border-slate-100 bg-slate-50 p-4">
                <h4 className="text-sm font-bold text-slate-950">Order Details</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {detailRows(activeItem).map(([label, value]) => (
                    <div key={label} className="rounded-md border border-slate-200 bg-white px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">{label}</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-800">{value}</p>
                    </div>
                  ))}
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

function detailRows(item: AssignedItem) {
  return [
    ['Order Number', item.orderNumber],
    ['Order type', item.orderType],
    ['Submission deadline', formatDeadline(item.deadline)],
    ['Assignment type', item.assignmentType],
  ];
}
