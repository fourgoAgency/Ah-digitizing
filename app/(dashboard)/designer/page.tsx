'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, ChevronDown, Clock3, Download, RotateCcw, UploadCloud } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { uploadFile, updateDocument } from '@/lib/firebase';

type QuoteDoc = Record<string, unknown> & { id: string; source: 'quotes' | 'quoteRequests' };

type AssignedApiDoc = Record<string, unknown> & {
  id: string;
  source: 'quotes' | 'quoteRequests';
};

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

type FilterOption = { value: string; label: string };
type CompletedBreakdown = {
  orderTypes: { Embroidery: number; Vector: number; Quote: number };
  turnaround: { Standard: number; Rush: number; 'Super Rush': number };
};

function FilterDropdown({
  label,
  value,
  options,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative min-w-40 scale-z-100">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1 text-left transition ${
          open ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-100/80'
        }`}
      >
        <span>{label}</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-left normal-case tracking-normal shadow-xl ring-1 ring-slate-950/5" role="listbox">
          {options.map((option) => {
            const selected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  selected ? 'bg-slate-100 text-slate-950' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                {option.label}
                {selected ? <Check className="h-4 w-4 text-slate-900" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

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

function getTurnaroundPriority(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes('super rush')) return 0;
  if (normalized.includes('rush')) return 1;
  return 2;
}

function getOrderType(value: unknown, source: AssignedItem['source']) {
  if (source === 'quoteRequests') return 'Quote';
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized.includes('embroidery')) return 'Embroidery';
  if (normalized.includes('vector')) return 'Vector';
  if (normalized.includes('quote')) return 'Quote';
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Quote';
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

  // Firestore Timestamps become plain objects when returned through the API.
  const seconds = record?._seconds ?? record?.seconds;
  const nanoseconds = record?._nanoseconds ?? record?.nanoseconds ?? 0;
  if (typeof seconds === 'number' && typeof nanoseconds === 'number') {
    const date = new Date(seconds * 1000 + nanoseconds / 1_000_000);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function formatDeadline(value: string | Date) {
  const date = getDate(value);
  if (!date) return typeof value === 'string' && value ? value : 'Not set';
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
  const filesArray = Array.isArray(document.designerSubmissionFiles) ? document.designerSubmissionFiles : [];
  const firstFile = filesArray.length > 0 ? asRecord(filesArray[0]) : null;
  const directUrl = getString(document, ['designerSubmissionUrl', 'submissionUrl', 'resultUrl', 'downloadURL', 'downloadUrl']);
  const directPath = getString(document, ['designerSubmissionPath', 'submissionPath', 'resultPath', 'storagePath']);
  const fileName = getString(document, ['designerSubmissionName', 'submissionName', 'resultName']);

  return {
    submission,
    fileCount: filesArray.length,
    url: directUrl || getString(firstFile ?? {}, ['downloadURL', 'downloadUrl', 'url', 'fileUrl', 'storageUrl']) || getString(submission ?? {}, ['downloadURL', 'downloadUrl', 'url', 'fileUrl', 'storageUrl']),
    path: directPath || getString(firstFile ?? {}, ['storagePath', 'path']) || getString(submission ?? {}, ['storagePath', 'path']),
    fileName: fileName || getString(firstFile ?? {}, ['fileName', 'name', 'title']) || getString(submission ?? {}, ['name', 'fileName', 'title']),
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

const DESIGNER_ASSIGNMENT_READ_KEY = 'designer-assigned-read-items';

export default function DesignerPage() {
  const { customUser } = useAuth();
  const [assigned, setAssigned] = useState<AssignedItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [completedBreakdown, setCompletedBreakdown] = useState<CompletedBreakdown>({
    orderTypes: { Embroidery: 0, Vector: 0, Quote: 0 },
    turnaround: { Standard: 0, Rush: 0, 'Super Rush': 0 },
  });
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<AssignedItem | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderTypeFilter, setOrderTypeFilter] = useState('');
  const [turnaroundFilter, setTurnaroundFilter] = useState('');
  const [openFilter, setOpenFilter] = useState<'orderType' | 'turnaround' | null>(null);
  const [newlyAssignedIds, setNewlyAssignedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!customUser?.id && !customUser?.email) return;

    async function fetchAssignedQuotes() {
      try {
        const res = await fetch('/api/designer/assigned-quotes', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch assigned quotes');
        const { assigned, completedCount: completedAssignments = 0, completedBreakdown: savedBreakdown } = await res.json();

        const items: AssignedItem[] = assigned.map((doc: AssignedApiDoc) => ({
          id: doc.id,
          orderNumber: getString(doc, ['orderNumber'], 'Not Available'),
          source: doc.source,
          orderType: getOrderType(getString(doc, ['orderType', 'serviceType', 'type'], 'Quote'), doc.source as AssignedItem['source']),
          assignmentType: getString(doc, ['assignmentType'], 'Standard'),
          status: getString(doc, ['status'], 'Assigned to Designer'),
          assignedAt: getDate(doc.assignedAt),
          deadline: getString(doc, ['submissionDeadline', 'deadline'], ''),
          document: { ...doc, source: doc.source } as QuoteDoc,
        }));

        const sortedItems = items.sort((a, b) => {
          const turnaroundDifference = getTurnaroundPriority(a.assignmentType) - getTurnaroundPriority(b.assignmentType);
          if (turnaroundDifference !== 0) return turnaroundDifference;
          return (b.assignedAt?.getTime() || 0) - (a.assignedAt?.getTime() || 0);
        });

        if (typeof window !== 'undefined') {
          const readAssignments = new Set<string>(JSON.parse(localStorage.getItem(DESIGNER_ASSIGNMENT_READ_KEY) ?? '[]'));
          const currentAssignments = sortedItems.map((item) => `${item.source}:${item.id}`);
          const unreadAssignments = currentAssignments.filter((assignmentKey) => !readAssignments.has(assignmentKey));

          setNewlyAssignedIds(new Set(unreadAssignments));
          localStorage.setItem(DESIGNER_ASSIGNMENT_READ_KEY, JSON.stringify(Array.from(readAssignments)));
        }

        setAssigned(sortedItems);
        setCompletedCount(Number(completedAssignments) || 0);
        if (savedBreakdown) setCompletedBreakdown(savedBreakdown);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assigned quotes');
      } finally {
        setLoading(false);
      }
    }

    fetchAssignedQuotes();

    const interval = setInterval(fetchAssignedQuotes, 10000);

    return () => clearInterval(interval);
  }, [customUser?.email, customUser?.id]);

  const activeItem = useMemo(() => selectedItem, [selectedItem]);

  const filteredAssigned = useMemo(
    () => assigned.filter((item) => {
      const matchesOrderType = !orderTypeFilter || item.orderType.toLowerCase() === orderTypeFilter;
      const matchesTurnaround = !turnaroundFilter || item.assignmentType.toLowerCase() === turnaroundFilter;
      return matchesOrderType && matchesTurnaround;
    }),
    [assigned, orderTypeFilter, turnaroundFilter]
  );

  const stats = useMemo(() => {
    const isEditItem = (item: AssignedItem) => item.status.toLowerCase().includes('edit') || item.status.toLowerCase().includes('change');
    const activeSubmitted = assigned.filter((item) => !isEditItem(item) && getSubmissionInfo(item.document).url).length;
    const pending = assigned.filter((item) => !isEditItem(item) && !getSubmissionInfo(item.document).url).length;
    const embroidery = assigned.filter((item) => item.orderType === 'Embroidery').length + completedBreakdown.orderTypes.Embroidery;
    const vector = assigned.filter((item) => item.orderType === 'Vector').length + completedBreakdown.orderTypes.Vector;
    const quote = assigned.filter((item) => item.orderType === 'Quote').length + completedBreakdown.orderTypes.Quote;
    const edit = assigned.filter(isEditItem).length;
    const standard = assigned.filter((item) => item.assignmentType.toLowerCase() === 'standard').length + completedBreakdown.turnaround.Standard;
    const rush = assigned.filter((item) => item.assignmentType.toLowerCase() === 'rush').length + completedBreakdown.turnaround.Rush;
    const superRush = assigned.filter((item) => item.assignmentType.toLowerCase() === 'super rush').length + completedBreakdown.turnaround['Super Rush'];
    return { pending, edit, embroidery, vector, quote, standard, rush, superRush };
  }, [assigned, completedCount, completedBreakdown]);

  async function handleSubmitResult() {
    if (!activeItem || selectedFiles.length === 0) return;

    setUploadingId(activeItem.source + ':' + activeItem.id);
    setError(null);
    setMessage(null);

    try {
      const submittedAt = new Date().toISOString();
      const submissionFiles = await Promise.all(selectedFiles.map(async (file, index) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
        const storagePath = `designer-submissions/${activeItem.source}/${activeItem.id}/${Date.now()}-${index + 1}-${safeName}`;
        const downloadURL = await uploadFile(file, storagePath);
        return {
          fileName: file.name,
          storagePath,
          downloadURL,
          size: file.size,
          type: file.type,
        };
      }));
      const [firstFile] = submissionFiles;

      await updateDocument(activeItem.source, activeItem.id, {
        designerSubmission: {
          fileName: firstFile.fileName,
          storagePath: firstFile.storagePath,
          downloadURL: firstFile.downloadURL,
          submittedAt,
          submittedById: customUser?.id || null,
          submittedByEmail: customUser?.email || null,
        },
        designerSubmissionFiles: submissionFiles,
        designerSubmissionUrl: firstFile.downloadURL,
        designerSubmissionPath: firstFile.storagePath,
        designerSubmittedAt: submittedAt,
        status: 'Received',
      });

      setAssigned((current) => current.filter((item) => !(item.id === activeItem.id && item.source === activeItem.source)));
      setCompletedCount((current) => current + 1);
      setNewlyAssignedIds((current) => {
        const next = new Set(current);
        next.delete(`${activeItem.source}:${activeItem.id}`);
        return next;
      });
      setMessage('Submission uploaded successfully.');
      setSelectedItem(null);
      setSelectedFiles([]);
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
        <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Designer workspace</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">Assigned quotes</h1>
            <p className="mt-1 text-sm text-slate-600">Upload the finished artwork or embroidery file when you are done.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}
        {message ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
        ) : null}

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5 2xl:grid-cols-10">
          <Stat label="Assigned" value={stats.pending} />
          <Stat label="Embroidery" value={stats.embroidery} />
          <Stat label="Vector" value={stats.vector} />
          <Stat label="Quote" value={stats.quote} />
          <Stat label="Edit" value={stats.edit} />
          <Stat label="Standard" value={stats.standard} />
          <Stat label="Rush" value={stats.rush} />
          <Stat label="Super Rush" value={stats.superRush} />
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Your queue</h2>
              <p className="mt-1 text-sm text-slate-600">Only quotes assigned to your account appear here.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock3 className="h-4 w-4" />
              {loading ? 'Loading...' : `${filteredAssigned.length} item${filteredAssigned.length === 1 ? '' : 's'}`}
              {orderTypeFilter || turnaroundFilter ? (
                <button
                  type="button"
                  onClick={() => {
                    setOrderTypeFilter('');
                    setTurnaroundFilter('');
                  }}
                  className="ml-2 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset filters
                </button>
              ) : null}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Order No</th>
                  <th className="px-5 py-3">
                    <FilterDropdown
                      label="Order Type"
                      value={orderTypeFilter}
                      open={openFilter === 'orderType'}
                      onToggle={() => setOpenFilter(openFilter === 'orderType' ? null : 'orderType')}
                      onChange={(value) => {
                        setOrderTypeFilter(value);
                        setOpenFilter(null);
                      }}
                      options={[
                        { value: 'embroidery', label: 'Embroidery' },
                        { value: 'vector', label: 'Vector' },
                        { value: 'quote', label: 'Quote' },
                      ]}
                    />
                  </th>
                  <th className="px-5 py-3">Assign Date &amp; Time</th>
                  <th className="px-5 py-3">
                    <FilterDropdown
                      label="Turn Around Time"
                      value={turnaroundFilter}
                      open={openFilter === 'turnaround'}
                      onToggle={() => setOpenFilter(openFilter === 'turnaround' ? null : 'turnaround')}
                      onChange={(value) => {
                        setTurnaroundFilter(value);
                        setOpenFilter(null);
                      }}
                      options={[
                        { value: 'super rush', label: 'Super Rush' },
                        { value: 'rush', label: 'Rush' },
                        { value: 'standard', label: 'Standard' },
                      ]}
                    />
                  </th>
                  <th className="px-5 py-3">Deadline</th>
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
                ) : filteredAssigned.length === 0 ? (
                  <tr>
                    <td className="px-5 py-16 text-center text-sm text-slate-500" colSpan={6}>
                      No assigned orders match these filters.
                    </td>
                  </tr>
                ) : (
                  filteredAssigned.map((item) => {
                    const key = `${item.source}:${item.id}`;
                    const isNewlyAssigned = newlyAssignedIds.has(key);

                    return (
                      <tr
                        key={key}
                        className={`text-sm transition-colors ${isNewlyAssigned ? 'bg-primary/10 ring-1 ring-primary/20 text-slate-900' : 'bg-white text-slate-700'}`}
                      >
                        <td className={`px-5 py-4 font-bold ${isNewlyAssigned ? 'text-slate-950' : 'font-medium text-slate-950'}`}>{item.orderNumber}</td>
                        <td className={`px-5 py-4 ${isNewlyAssigned ? 'font-bold text-slate-900' : ''}`}>{item.orderType}</td>
                        <td className={`px-5 py-4 ${isNewlyAssigned ? 'font-bold text-slate-900' : ''}`}>{item.assignedAt ? formatDeadline(item.assignedAt) : 'Not set'}</td>
                        <td className={`px-5 py-4 ${isNewlyAssigned ? 'font-bold text-slate-900' : ''}`}>{item.assignmentType}</td>
                        <td className={`px-5 py-4 ${isNewlyAssigned ? 'font-bold text-slate-900' : ''}`}>{formatDeadline(item.deadline)}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setNewlyAssignedIds((current) => {
                                const next = new Set(current);
                                next.delete(key);
                                return next;
                              });
                              if (typeof window !== 'undefined') {
                                const readAssignments = new Set<string>(JSON.parse(localStorage.getItem(DESIGNER_ASSIGNMENT_READ_KEY) ?? '[]'));
                                readAssignments.add(key);
                                localStorage.setItem(DESIGNER_ASSIGNMENT_READ_KEY, JSON.stringify(Array.from(readAssignments)));
                              }
                              setSelectedItem(item);
                            }}
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
                {activeItem.status.toLowerCase().includes('edit') || activeItem.status.toLowerCase().includes('change') ? (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                    Changes requested: {getString(activeItem.document, ['editRequest', 'adminEditRequest'], 'Please review and update the submitted work.')}
                  </p>
                ) : null}
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
                    setSelectedFiles([]);
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
                  multiple
                  className="hidden"
                  onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
                />
                <UploadCloud className="mx-auto h-8 w-8 text-slate-500" />
                <p className="mt-3 text-sm font-medium text-slate-900">
                  {selectedFiles.length > 0 ? `${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'} selected` : 'Click to choose files to upload'}
                </p>
                <p className="mt-1 text-xs text-slate-500">PDF, ZIP, PNG, AI, DST, PES, or any final deliverable file. You can select multiple files.</p>
              </label>

              {selectedFiles.length > 0 ? (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{file.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">{Math.ceil(file.size / 1024)} KB</span>
                          <button
                            type="button"
                            onClick={() => setSelectedFiles((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    setSelectedFiles([]);
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={selectedFiles.length === 0 || uploadingId === `${activeItem.source}:${activeItem.id}`}
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

function formatOutputFormat(value: unknown) {
  if (Array.isArray(value)) {
    const formatted = value
      .map((entry) => (typeof entry === 'string' ? entry.trim() : String(entry ?? '').trim()))
      .filter(Boolean);
    return formatted.length > 0 ? formatted.join(', ') : 'Not provided';
  }

  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value && typeof value === 'object') {
    const record = asRecord(value);
    const nested = record ? getString(record, ['name', 'label', 'value', 'format'], 'Not provided') : 'Not provided';
    return nested;
  }

  return 'Not provided';
}

function detailRows(item: AssignedItem) {
  return [
    ['Order Number', item.orderNumber],
    ['Order type', item.orderType],
    ['Assign Date & Time', item.assignedAt ? formatDeadline(item.assignedAt) : 'Not set'],
    ['Submission deadline', formatDeadline(item.deadline)],
    ['Turn Around Time', item.assignmentType],
    ['Output format', formatOutputFormat(item.document.outputFormats ?? item.document.outputFormat ?? item.document.format ?? item.document.outputFormatOther ?? item.document.outputFormatsOther)],
  ];
}
