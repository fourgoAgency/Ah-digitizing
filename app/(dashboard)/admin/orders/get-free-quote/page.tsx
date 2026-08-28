"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { Download, Eye, UploadCloud, X } from "lucide-react";
import { firestore, uploadFile } from "@/lib/firebase";

type QuoteDocument = Record<string, unknown> & { id: string };
type Designer = { id: string; email: string; name: string };
const countryNames: Record<string, string> = { US: "United States", GB: "United Kingdom", CA: "Canada", AU: "Australia" };
const quoteStatuses = ["Pending", "Assigned to Designer", "Completed"] as const;
const quoteInfoOrder = [
  "files",
  "orderType",
  "designName",
  "numberOfColors",
  "unitType",
  "width",
  "height",
  "additionalNotes",
  "whatsappOptIn",
  "createdAt",
  "submittedAt",
];

function getString(document: QuoteDocument, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = document[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return fallback;
}
function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}
function getDate(value: unknown) {
  if (typeof value === "string") { const d = new Date(value); return Number.isNaN(d.getTime()) ? null : d; }
  if (typeof value === "number") { const d = new Date(value); return Number.isNaN(d.getTime()) ? null : d; }
  const record = asRecord(value);
  if (record && typeof record.toDate === "function") { const d = record.toDate(); return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null; }
  return null;
}
function formatCreatedAt(date: Date | null) {
  if (!date) return "Unknown";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(date).replace(",", " -");
}
function getCountryName(value: unknown) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "Not provided";
  return countryNames[raw.toUpperCase()] || raw;
}
function prettifyKey(key: string) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase());
}
function formatFileSize(size: number) {
  if (!Number.isFinite(size)) return "Unknown";
  const mb = size / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}
function getStorageFileUrl(file: unknown) {
  const record = asRecord(file);
  if (!record) return "";
  const candidates = [record.downloadURL, record.downloadUrl, record.url, record.storageUrl, record.fileUrl, record.path];
  return (candidates.find((candidate) => typeof candidate === "string" && candidate.trim()) as string | undefined) || "";
}

function formatInfoValue(key: string, value: unknown) {
  if (key === "createdAt" || key === "submittedAt" || key === "assignedAt" || key === "submissionDeadline") return formatCreatedAt(getDate(value));
  if (key === "country") return getCountryName(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  return value ? JSON.stringify(value) : "Not provided";
}

function getQuoteType(quote: QuoteDocument) {
  const savedType = getString(quote, ["assignmentType", "type"]);
  if (["Standard", "Rush", "Super Rush"].includes(savedType)) return savedType;
  const turnaround = getString(quote, ["turnaroundTime"]).toLowerCase();
  if (turnaround.includes("1 to 4")) return "Super Rush";
  if (turnaround.includes("4 to 8")) return "Rush";
  return "Standard";
}

function getQuoteInfoEntries(quote: QuoteDocument) {
  const excludedKeys = ["id", "fullName", "name", "country", "companyName", "company", "email", "contactNumber", "phone", "files", "status", "turnaroundTime", "whatsappOptIn", "createdAt", "submittedAt", "assignedAt", "assignmentType", "submissionDeadline", "assignedDesignerId", "assignedDesignerName", "assignedDesignerEmail", "assignmentFiles", "designerSubmission", "designerSubmissionUrl", "designerSubmissionPath", "designerSubmittedAt", "verifiedAt"];
  return Object.entries(quote)
    .filter(([key, value]) => !excludedKeys.includes(key) && value !== null && value !== undefined && value !== "")
    .sort(([firstKey], [secondKey]) => {
      const firstIndex = quoteInfoOrder.indexOf(firstKey);
      const secondIndex = quoteInfoOrder.indexOf(secondKey);
      if (firstIndex === -1 && secondIndex === -1) return 0;
      if (firstIndex === -1) return 1;
      if (secondIndex === -1) return -1;
      return firstIndex - secondIndex;
    });
}

function downloadQuoteInfo(quote: QuoteDocument) {
  const content = getQuoteInfoEntries(quote)
    .map(([key, value]) => `${prettifyKey(key)}: ${formatInfoValue(key, value)}`)
    .join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${quote.orderNumber || quote.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function GetFreeQuoteAdminPage() {
  const searchParams = useSearchParams();
  const [quotes, setQuotes] = useState<QuoteDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState<QuoteDocument | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [selectedDesignerId, setSelectedDesignerId] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [assignmentType, setAssignmentType] = useState("Standard");
  const [selectedSubmissionFiles, setSelectedSubmissionFiles] = useState<File[]>([]);
  const [assigningDesigner, setAssigningDesigner] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(firestore, "quoteRequests"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuotes(snapshot.docs.map((document) => ({ ...document.data(), id: document.id })));
      setLoading(false);
    }, (snapshotError) => { setError(snapshotError.message); setLoading(false); });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const designerQuery = query(collection(firestore, "users"), where("role", "==", "designer"));
    const unsubscribe = onSnapshot(designerQuery, (snapshot) => {
      setDesigners(snapshot.docs.map((document) => {
        const data = { ...document.data(), id: document.id } as QuoteDocument;
        return { id: document.id, email: getString(data, ["email"]), name: getString(data, ["displayName", "name", "fullName"], getString(data, ["email"], "Designer")) };
      }).sort((a, b) => a.name.localeCompare(b.name)));
    });
    return () => unsubscribe();
  }, []);

  const rows = useMemo(() => quotes.map((quote) => ({
    id: quote.id,
    orderNo: typeof quote.orderNumber === "string" && quote.orderNumber ? quote.orderNumber : quote.id,
    type: getQuoteType(quote),
    createdAt: getDate(quote.submittedAt) || getDate(quote.createdAt),
    customer: getString(quote, ["fullName", "name"], "Customer"),
    email: getString(quote, ["email"]),
    status: getString(quote, ["status"], "Pending"),
    document: quote,
  })).filter((row) => {
    const search = (searchParams.get("q") || "").trim().toLowerCase();
    const status = searchParams.get("status") || "all";
    return (!search || row.id.toLowerCase().includes(search) || row.orderNo.toLowerCase().includes(search) || row.customer.toLowerCase().includes(search)) && (status === "all" || row.status.toLowerCase() === status.toLowerCase());
  }), [quotes, searchParams]);

  async function updateQuoteStatus(id: string, status: string) {
    setUpdatingId(id);
    try { await updateDoc(doc(firestore, "quoteRequests", id), { status }); } catch (e) { setError(e instanceof Error ? e.message : "Unable to update quote status."); } finally { setUpdatingId(null); }
  }
  async function assignQuoteToDesigner() {
    if (!activeQuote || !selectedDesignerId || !submissionDeadline || selectedSubmissionFiles.length === 0) return;
    const designer = designers.find((item) => item.id === selectedDesignerId);
    if (!designer) return;
    setAssigningDesigner(true); setAssignmentMessage(null);
    try {
      const assignmentFiles = await Promise.all(selectedSubmissionFiles.map(async (file, index) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
        const storagePath = `designer-assignment-files/quoteRequests/${activeQuote.id}/${Date.now()}-${index + 1}-${safeName}`;
        const downloadURL = await uploadFile(file, storagePath);
        return { fileName: file.name, name: file.name, storagePath, downloadURL, size: file.size, type: file.type };
      }));
      await updateDoc(doc(firestore, "quoteRequests", activeQuote.id), {
        assignedDesignerId: designer.id,
        assignedDesignerName: designer.name,
        assignedDesignerEmail: designer.email,
        assignedAt: serverTimestamp(),
        assignmentType,
        submissionDeadline: new Date(submissionDeadline).toISOString(),
        assignmentFiles,
        status: "Assigned to Designer",
      });
      setActiveQuote({
        ...activeQuote,
        assignedDesignerId: designer.id,
        assignedDesignerName: designer.name,
        assignedDesignerEmail: designer.email,
        assignedAt: new Date().toISOString(),
        assignmentType,
        submissionDeadline: new Date(submissionDeadline).toISOString(),
        assignmentFiles,
        status: "Assigned to Designer",
      });
      await fetch("/api/quote/assign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quoteId: activeQuote.id, orderType: getString(activeQuote, ["orderType"], "quote"), designerName: designer.name, designerEmail: designer.email }) });
      setAssignmentMessage("Assigned successfully.");
    } catch (e) { setAssignmentMessage(e instanceof Error ? e.message : "Unable to assign designer."); } finally { setAssigningDesigner(false); }
  }


  async function downloadQuoteFiles(quote: QuoteDocument) {
    const files = Array.isArray(quote.files) ? quote.files : [];
    if (files.length === 0) return;

    setDownloadingZip(true);
    setError(null);
    try {
      const response = await fetch("/api/quote/download-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: typeof quote.orderNumber === "string" && quote.orderNumber ? quote.orderNumber : quote.id, files: files.map((file) => ({ name: asRecord(file)?.name || asRecord(file)?.fileName, url: getStorageFileUrl(file) })) }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || "Unable to create ZIP download.");
      const archive = await response.blob();
      const objectUrl = URL.createObjectURL(archive);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${quote.id}.zip`;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (zipError) {
      setError(zipError instanceof Error ? zipError.message : "Unable to create ZIP download.");
    } finally {
      setDownloadingZip(false);
    }
  }

  return (
    <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-950">Get Free Quote Requests</h2><p className="text-sm text-slate-500">Submitted free quote requests from the public form.</p></div>{error ? <p className="text-xs font-medium text-rose-500">Firebase: {error}</p> : null}</div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead><tr className="border-y border-slate-100 text-xs font-medium text-slate-400"><th className="w-10 py-3" /><th className="py-3">Order</th><th className="py-3">Date</th><th className="py-3">Customer</th><th className="py-3">Type</th><th className="py-3">Order Status</th><th className="py-3 text-right">Action</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="py-16 text-center text-sm text-slate-400">Loading free quote requests...</td></tr> : rows.length > 0 ? rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 text-xs text-slate-700 hover:bg-slate-50/70">
                <td className="py-3" />
                <td className="py-3 font-semibold text-slate-800">{row.orderNo}</td>
                <td className="py-3">{formatCreatedAt(row.createdAt)}</td>
                <td className="py-3"><div className="font-medium text-slate-800">{row.customer}</div><div className="text-[11px] text-slate-500">{row.email}</div></td><td className="py-3 font-medium text-slate-700">{row.type}</td>
                <td className="py-3"><select value={quoteStatuses.find((s) => s.toLowerCase() === row.status.toLowerCase()) ?? "Pending"} onChange={(e) => updateQuoteStatus(row.id, e.target.value)} disabled={updatingId === row.id} className={`h-6 rounded px-2 text-xs font-semibold outline-none ${row.status.toLowerCase().includes("assigned") ? "bg-blue-100 text-blue-700" : row.status.toLowerCase().includes("completed") ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{quoteStatuses.map((s) => <option key={s} value={s}>{s}</option>)}</select></td>
                <td className="py-3 text-right"><button type="button" onClick={() => setActiveQuote(row.document)} className="inline-flex h-8 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-xs font-semibold text-blue-600 hover:bg-blue-50"><Eye className="h-3.5 w-3.5" />View detail</button></td>
              </tr>
            )) : <tr><td colSpan={7} className="py-16 text-center text-sm text-slate-400">No free quote requests found.</td></tr>}
          </tbody>
        </table>
      </div>

      {activeQuote ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-md bg-white shadow-xl">
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div><p className="text-xs font-semibold uppercase tracking-normal text-slate-400">Quote Detail</p><h3 className="mt-1 text-xl font-bold text-slate-950">{getString(activeQuote, ["fullName", "name"], "Customer")}</h3><p className="mt-1 text-xs font-semibold text-slate-500">Order No: {typeof activeQuote.orderNumber === "string" && activeQuote.orderNumber ? activeQuote.orderNumber : activeQuote.id}</p></div>
              <button type="button" onClick={() => setActiveQuote(null)} className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50"><X className="h-4 w-4" /></button>
            </header>
            <div className="max-h-[calc(90vh-78px)] overflow-y-auto px-5 py-5">
              <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Order Number</p><p className="mt-1 text-sm font-medium text-slate-800">{typeof activeQuote.orderNumber === "string" && activeQuote.orderNumber ? activeQuote.orderNumber : activeQuote.id}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Customer Name</p><p className="mt-1 text-sm font-medium text-slate-800">{getString(activeQuote, ["fullName", "name"], "Not provided")}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Country</p><p className="mt-1 text-sm font-medium text-slate-800">{getCountryName(getString(activeQuote, ["country"], ""))}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Company</p><p className="mt-1 text-sm font-medium text-slate-800">{getString(activeQuote, ["companyName", "company"], "Not provided")}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Email</p><p className="mt-1 text-sm font-medium text-slate-800">{getString(activeQuote, ["email"], "Not provided")}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Contact No</p><p className="mt-1 text-sm font-medium text-slate-800">{getString(activeQuote, ["contactNumber", "phone"], "Not provided")}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Created At</p><p className="mt-1 text-sm font-medium text-slate-800">{formatCreatedAt(getDate(activeQuote.submittedAt) || getDate(activeQuote.createdAt))}</p></div><div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Type</p><p className="mt-1 text-sm font-medium text-slate-800">{getQuoteType(activeQuote)}</p></div>
              </section>
              <section className="mt-6 rounded-md border border-slate-100 bg-slate-50 p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h4 className="text-sm font-bold text-slate-950">Assign to Designer</h4><p className="mt-1 text-xs text-slate-500">Select a designer and set the submission deadline.</p></div></div>
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
                  <label className="block"><span className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Type</span><select value={assignmentType} onChange={(e) => setAssignmentType(e.target.value)} className="mt-1 h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"><option>Standard</option><option>Rush</option><option>Super Rush</option></select></label>
                  <label className="block"><span className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Designer</span><select value={selectedDesignerId} onChange={(e) => setSelectedDesignerId(e.target.value)} className="mt-1 h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"><option value="">Select designer</option>{designers.map((designer) => <option key={designer.id} value={designer.id}>{designer.name}{designer.email ? ` - ${designer.email}` : ""}</option>)}</select></label>
                  <label className="block"><span className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Submission Deadline</span><input type="datetime-local" value={submissionDeadline} onChange={(e) => setSubmissionDeadline(e.target.value)} className="mt-1 h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500" /></label>
                  <button type="button" disabled={!selectedDesignerId || !submissionDeadline || selectedSubmissionFiles.length === 0 || assigningDesigner} onClick={assignQuoteToDesigner} className="mt-5 inline-flex h-10 items-center justify-center rounded bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 lg:mt-[19px]">{assigningDesigner ? "Assigning..." : "Assign"}</button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><UploadCloud className="h-3.5 w-3.5" /><input type="file" multiple className="sr-only" onChange={(e) => setSelectedSubmissionFiles(Array.from(e.target.files ?? []))} />Choose upload files</label>
                  <span className="max-w-xs truncate text-xs text-slate-500">{selectedSubmissionFiles.length > 0 ? `${selectedSubmissionFiles.length} file${selectedSubmissionFiles.length === 1 ? "" : "s"} selected` : "No files selected"}</span>
                </div>
                {assignmentMessage ? <p className={`mt-3 text-xs font-semibold ${assignmentMessage.includes("success") ? "text-emerald-600" : "text-rose-500"}`}>{assignmentMessage}</p> : null}
                {activeQuote.assignedDesignerId ? (
                  <div className="mt-4 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      ["Submission Deadline", activeQuote.submissionDeadline],
                      ["Assigned At", activeQuote.assignedAt],
                      ["Assignment Type", activeQuote.assignmentType],
                      ["Assigned Designer Id", activeQuote.assignedDesignerId],
                      ["Assigned Designer Name", activeQuote.assignedDesignerName],
                      ["Assigned Designer Email", activeQuote.assignedDesignerEmail],
                    ].map(([label, value]) => (
                      <div key={String(label)}>
                        <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">{String(label)}</p>
                        <p className="mt-1 break-words text-sm font-medium text-slate-800">{formatInfoValue(label === "Submission Deadline" ? "submissionDeadline" : label === "Assigned At" ? "assignedAt" : String(label), value)}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {Array.isArray(activeQuote.assignmentFiles) && activeQuote.assignmentFiles.length > 0 ? (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Assigned Files</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeQuote.assignmentFiles.map((file, index) => {
                        const record = asRecord(file);
                        const url = getStorageFileUrl(file);
                        const name = typeof record?.name === "string" ? record.name : `File ${index + 1}`;
                        return url ? <a key={`${name}-${index}`} href={url} target="_blank" rel="noreferrer" className="rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 underline">{name}</a> : null;
                      })}
                    </div>
                  </div>
                ) : null}
              </section>
              <section className="mt-6 rounded-md border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-bold text-slate-950">Quote Info</h4>
                  <button type="button" onClick={() => downloadQuoteInfo(activeQuote)} className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <Download className="h-3.5 w-3.5" />
                    Download TXT
                  </button>
                  <button type="button" onClick={() => downloadQuoteFiles(activeQuote)} disabled={!Array.isArray(activeQuote.files) || activeQuote.files.length === 0 || downloadingZip} className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                    <Download className="h-3.5 w-3.5" />
                    {downloadingZip ? "Preparing ZIP..." : "Download ZIP"}
                  </button>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(activeQuote).filter(([key]) => !["id","fullName","name","country","companyName","company","email","contactNumber","phone","verifiedAt","assignedAt","assignmentType","submissionDeadline","assignedDesignerId","assignedDesignerName","assignedDesignerEmail","assignmentFiles"].includes(key)).filter(([, value]) => value !== null && value !== undefined && value !== "").sort(([firstKey], [secondKey]) => {
                    const firstIndex = quoteInfoOrder.indexOf(firstKey);
                    const secondIndex = quoteInfoOrder.indexOf(secondKey);
                    if (firstIndex === -1 && secondIndex === -1) return 0;
                    if (firstIndex === -1) return 1;
                    if (secondIndex === -1) return -1;
                    return firstIndex - secondIndex;
                  }).map(([key, value]) => {
                    if (Array.isArray(value)) {
                      return (
                        <div key={key} className="md:col-span-2 lg:col-span-3">
                          <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">{prettifyKey(key)}</p>
                          <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {value.map((item, index) => {
                              const record = asRecord(item);
                              const fileUrl = getStorageFileUrl(item);
                              const label = typeof record?.name === "string" && record.name ? record.name : `${prettifyKey(key)} ${index + 1}`;
                              const size = typeof record?.size === "number" ? formatFileSize(record.size) : "";
                              return (
                                <div key={`${key}-${index}`} className="rounded border border-slate-200 bg-white p-3">
                                  <p className="text-sm font-medium text-slate-800">{label}</p>
                                  {size ? <p className="mt-1 text-xs text-slate-500">{size}</p> : null}
                                  {fileUrl ? <><a href={fileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-blue-600 underline">Open file</a>{fileUrl.match(/\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i) ? <img src={fileUrl} alt={label} className="mt-2 max-h-40 w-full rounded object-contain" /> : null}</> : <p className="mt-1 text-xs text-slate-500 break-words">{formatInfoValue(key, item)}</p>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return <div key={key}><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">{prettifyKey(key)}</p><p className="mt-1 break-words text-sm font-medium text-slate-800">{formatInfoValue(key, value)}</p></div>;
                  })}
                </div>
              </section>
            </div>
            <div className="border-t border-slate-100 px-5 py-4"><button type="button" onClick={() => setActiveQuote(null)} className="rounded border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Close</button></div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
