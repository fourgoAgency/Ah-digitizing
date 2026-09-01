"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { Download, Eye, Trash2, X } from "lucide-react";
import { deleteDocument, firestore, uploadFile } from "@/lib/firebase";
import { createQuoteText } from "@/lib/quote-text";
import { countryOptions } from "@/app/(main)/get-quote/lib/country-options";

type QuoteDocument = Record<string, unknown> & { id: string };
type Designer = { id: string; email: string; name: string };

const quoteInfoOrder = [
  "orderNumber",
  "createdAt",
  "status",
  "designName",
  "turnaroundTime",
  "orderType",
  "unitSelect",
  "width",
  "height",
  "outputFormats",
  "appliqueRequired",
  "colorsName",
  "numberOfColors",
  "colorwayToUse",
  "additionalNotes",
];

const quoteStatuses = [
  "Pending",
  "Assigned to Designer",
  "Submitted",
  "Completed"
] as const;

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
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const record = asRecord(value);
  if (record && typeof record.toDate === "function") {
    const date = record.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
  }
  return null;
}

function formatCreatedAt(date: Date | null) {
  if (!date) return "Unknown";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date).replace(/\b(am|pm)\b/gi, (part) => part.toUpperCase()).replace(",", " -");
}

function getCountryName(value: unknown) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "Not provided";
  const code = raw.toUpperCase();
  return countryOptions.find((country) => country.code === code)?.name || raw;
}

function prettifyKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
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

function getFileExtension(file: unknown, fileUrl: string) {
  const record = asRecord(file);
  const fileName = [record?.name, record?.fileName, fileUrl].find((value) => typeof value === "string" && value.trim()) as string | undefined;
  return fileName?.split(/[?#]/)[0].split(".").pop()?.toLowerCase() || "";
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
  const excludedKeys = [
    "id",
    "fullName",
    "name",
    "country",
    "companyName",
    "company",
    "email",
    "contactNumber",
    "phone",
    "files",
    "status",
    "turnaroundTime",
    "whatsappOptIn",
    "createdAt",
    "submittedAt",
    "assignedAt",
    "assignmentType",
    "submissionDeadline",
    "assignedDesignerId",
    "assignedDesignerName",
    "assignedDesignerEmail",
    "assignmentFiles",
    "designerSubmission",
    "designerSubmissionUrl",
    "designerSubmissionPath",
    "designerSubmittedAt",
    "verifiedAt",
  ];

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

function formatColorsName(value: unknown) {
  const colors = Array.isArray(value)
    ? value.map((color) => String(color).trim()).filter(Boolean)
    : String(value ?? "").split(/[,/]/).map((color) => color.trim()).filter(Boolean);
  return colors.join(", ") || "Not provided";
}

function downloadQuoteInfo(quote: QuoteDocument) {
  const content = createQuoteText(quote);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${getString(quote, ["orderNumber"], "quote")}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function GetQuoteAdminPage() {
  const searchParams = useSearchParams();
  const [quotes, setQuotes] = useState<QuoteDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState<QuoteDocument | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [selectedDesignerId, setSelectedDesignerId] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [assignmentType, setAssignmentType] = useState("Standard");
  const [selectedSubmissionFiles, setSelectedSubmissionFiles] = useState<File[]>([]);
  const [assigningDesigner, setAssigningDesigner] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingSubmission, setDownloadingSubmission] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(firestore, "quotes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setQuotes(snapshot.docs.map((document) => ({ ...document.data(), id: document.id })));
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const designerQuery = query(collection(firestore, "users"), where("role", "==", "designer"));
    const unsubscribe = onSnapshot(designerQuery, (snapshot) => {
      setDesigners(
        snapshot.docs
          .map((document) => {
            const data = { ...document.data(), id: document.id } as QuoteDocument;
            return {
              id: document.id,
              email: getString(data, ["email"]),
              name: getString(data, ["displayName", "name", "fullName"], getString(data, ["email"], "Designer")),
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    });

    return () => unsubscribe();
  }, []);

  const rows = useMemo(
    () =>
      quotes.map((quote) => ({
        id: quote.id,
        orderNo: getString(quote, ["orderNumber"], "Not Available"),
        type: getQuoteType(quote),
        createdAt: getDate(quote.createdAt) || getDate(quote.submittedAt),
        customer: getString(quote, ["fullName", "name"], "Customer"),
        email: getString(quote, ["email"]),
        status: getString(quote, ["status"], "Pending"),
        document: quote,
      })).filter((row) => {
        const search = (searchParams.get("q") || "").trim().toLowerCase();
        const status = searchParams.get("status") || "all";
        return (!search || row.id.toLowerCase().includes(search) || row.orderNo.toLowerCase().includes(search) || row.customer.toLowerCase().includes(search)) && (status === "all" || row.status.toLowerCase() === status.toLowerCase());
      }),
    [quotes, searchParams]
  );

  const visibleIds = rows.map((row) => row.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  function toggleSelected(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]));
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      if (allVisibleSelected) return current.filter((id) => !visibleIds.includes(id));
      return [...current, ...visibleIds.filter((id) => !current.includes(id))];
    });
  }

  async function updateQuoteStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await updateDoc(doc(firestore, "quotes", id), { status });
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update quote status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteSelectedQuotes() {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected quote request${selectedIds.length === 1 ? "" : "s"}?`)) return;

    setDeletingId("selected");
    setError(null);
    try {
      await Promise.all(selectedIds.map((id) => deleteDocument("quotes", id)));
      if (activeQuote && selectedIds.includes(activeQuote.id)) setActiveQuote(null);
      setSelectedIds([]);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete quote request.");
    } finally {
      setDeletingId(null);
    }
  }

  async function assignQuoteToDesigner() {
    if (!activeQuote || !selectedDesignerId || !submissionDeadline || selectedSubmissionFiles.length === 0) return;
    const designer = designers.find((item) => item.id === selectedDesignerId);
    if (!designer) return;

    setAssigningDesigner(true);
    setAssignmentMessage(null);

    try {
      const assignmentFiles = await Promise.all(selectedSubmissionFiles.map(async (file, index) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
        const storagePath = `designer-assignment-files/quotes/${activeQuote.id}/${Date.now()}-${index + 1}-${safeName}`;
        const downloadURL = await uploadFile(file, storagePath);
        return { fileName: file.name, name: file.name, storagePath, downloadURL, size: file.size, type: file.type };
      }));
      await updateDoc(doc(firestore, "quotes", activeQuote.id), {
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
      const assignResponse = await fetch("/api/quote/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: activeQuote.id,
          orderNumber: getString(activeQuote, ["orderNumber"], "Not Available"),
          orderType: getString(activeQuote, ["orderType"], "quote"),
          designerName: designer.name,
          designerEmail: designer.email,
          submissionType: "order",
        }),
      });
      const assignResult = await assignResponse.json().catch(() => null);
      if (!assignResponse.ok) {
        throw new Error(assignResult?.error || "Unable to send assignment email.");
      }
      setAssignmentMessage("Assigned successfully.");
    } catch (assignError) {
      setAssignmentMessage(assignError instanceof Error ? assignError.message : "Unable to assign designer.");
    } finally {
      setAssigningDesigner(false);
    }
  }

  async function downloadQuoteFiles(quote: QuoteDocument) {
    const files = Array.isArray(quote.files) ? quote.files : [];
    if (files.length === 0) return;
    const orderNumber = getString(quote, ["orderNumber"], "quote");

    setDownloadingZip(true);
    setError(null);
    try {
      const response = await fetch("/api/quote/download-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, files: files.map((file) => ({ name: asRecord(file)?.name || asRecord(file)?.fileName, url: getStorageFileUrl(file) })) }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || "Unable to create ZIP download.");
      const archive = await response.blob();
      const objectUrl = URL.createObjectURL(archive);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${orderNumber}.zip`;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (zipError) {
      setError(zipError instanceof Error ? zipError.message : "Unable to create ZIP download.");
    } finally {
      setDownloadingZip(false);
    }
  }

  async function downloadDesignerSubmission() {
    if (!submissionUrl || downloadingSubmission) return;

    setDownloadingSubmission(true);
    setError(null);
    try {
      const response = await fetch(submissionUrl);
      if (!response.ok) throw new Error("Unable to download the designer submission.");
      const fileBlob = await response.blob();
      const objectUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = submissionFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Unable to download the designer submission.");
    } finally {
      setDownloadingSubmission(false);
    }
  }

  const designerSubmission = activeQuote
    ? asRecord(activeQuote.designerSubmission)
    : null;

  const submissionUrl =
    activeQuote &&
      typeof activeQuote.designerSubmissionUrl === "string"
      ? activeQuote.designerSubmissionUrl
      : typeof designerSubmission?.downloadURL === "string"
        ? designerSubmission.downloadURL
        : "";

  const submissionFileName =
    typeof designerSubmission?.fileName === "string"
      ? designerSubmission.fileName
      : "submission";
  const extension = submissionFileName.split(".").pop()?.toLowerCase() ?? "";

  const imageTypes = ["png", "jpg", "jpeg", "gif", "webp"];
  const pdfTypes = ["pdf"];

  const isImage = imageTypes.includes(extension);
  const isPdf = pdfTypes.includes(extension);
  const assignmentDetails: Array<[string, unknown]> = [
    ["Submission Deadline", activeQuote?.submissionDeadline],
    ["Assigned At", activeQuote?.assignedAt],
    ["Assignment Type", activeQuote?.assignmentType],
    ["Assigned Designer Id", activeQuote?.assignedDesignerId],
    ["Assigned Designer Name", activeQuote?.assignedDesignerName],
    ["Assigned Designer Email", activeQuote?.assignedDesignerEmail],
  ];
  return (
    <section className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Order Form Requests</h2>
          <p className="text-sm text-slate-500">Submitted embroidery and vector order requests.</p>
        </div>
        {error ? <p className="text-xs font-medium text-rose-500">Firebase: {error}</p> : null}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-end gap-3">
        <button type="button" disabled={selectedIds.length === 0 || deletingId === "selected"} onClick={deleteSelectedQuotes} className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-blue-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="Delete selected quote requests">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="border-y border-slate-100 text-xs font-medium text-slate-400">
              <th className="w-10 py-3">
                <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
              </th>
              <th className="py-3">Order</th>
              <th className="py-3">Date</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Type</th>
              <th className="py-3">Order Status</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-slate-400">
                  Loading quote requests...
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 text-xs text-slate-700 hover:bg-slate-50/70">
                  <td className="py-3">
                    <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleSelected(row.id)} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
                  </td>
                  <td className="py-3 font-semibold text-slate-800">{row.orderNo}</td>
                  <td className="py-3">{formatCreatedAt(row.createdAt)}</td>
                  <td className="py-3">
                    <div className="font-medium text-slate-800">{row.customer}</div>
                    <div className="text-[11px] text-slate-500">{row.email}</div>
                  </td>
                  <td className="py-3 font-medium text-slate-700">{row.type}</td>
                  <td className="py-3">
                    <select
                      value={quoteStatuses.find((status) => status.toLowerCase() === row.status.toLowerCase()) ?? "Pending"}
                      onChange={(event) => updateQuoteStatus(row.id, event.target.value)}
                      disabled={updatingId === row.id}
                      className={`h-6 rounded px-2 text-xs font-semibold outline-none ${row.status.toLowerCase().includes("assigned") ? "bg-blue-100 text-blue-700" : row.status.toLowerCase().includes("completed") ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                    >
                      {quoteStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveQuote(row.document)}
                      className="inline-flex h-8 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-slate-400">
                  No quote requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activeQuote ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-md bg-white shadow-xl">
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-slate-400">Quote Detail</p>
                <h3 className="mt-1 text-xl font-bold text-slate-950">{getString(activeQuote, ["fullName", "name"], "Customer")}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">Order No: {getString(activeQuote, ["orderNumber"], "Not Available")}</p>
              </div>
              <button type="button" onClick={() => setActiveQuote(null)} className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex max-h-[calc(90vh-78px)] flex-col overflow-y-auto px-5 py-5">
              <section className="order-1 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div className="md:col-span-2 lg:col-span-3"><h4 className="text-sm font-bold text-slate-950">Contact Info</h4></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Customer Name</p><p className="mt-1 text-sm font-medium text-slate-800">{getString(activeQuote, ["fullName", "name"], "Not provided")}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Country</p><p className="mt-1 text-sm font-medium text-slate-800">{getCountryName(getString(activeQuote, ["country"], ""))}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Company</p><p className="mt-1 text-sm font-medium text-slate-800">{getString(activeQuote, ["companyName", "company"], "Not provided")}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Email</p><p className="mt-1 text-sm font-medium text-slate-800">{getString(activeQuote, ["email"], "Not provided")}</p></div>
                <div><p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Contact No</p><p className="mt-1 text-sm font-medium text-slate-800">{getString(activeQuote, ["contactNumber", "phone"], "Not provided")}</p></div>
              </section>

              <section className="order-3 mt-6 rounded-md border border-slate-100 bg-slate-50 p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">Assign to Designer</h4>
                    <p className="mt-1 text-xs text-slate-500">Select a designer and set the submission deadline.</p>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
                  <label className="block"><span className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Type</span><select value={assignmentType} onChange={(event) => setAssignmentType(event.target.value)} className="mt-1 h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"><option>Standard</option><option>Rush</option><option>Super Rush</option></select></label>
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Designer</span>
                    <select value={selectedDesignerId} onChange={(event) => setSelectedDesignerId(event.target.value)} className="mt-1 h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500">
                      <option value="">Select designer</option>
                      {designers.map((designer) => (
                        <option key={designer.id} value={designer.id}>
                          {designer.name}
                          {designer.email ? ` - ${designer.email}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Submission Deadline</span>
                    <input type="datetime-local" value={submissionDeadline} onChange={(event) => setSubmissionDeadline(event.target.value)} className="mt-1 h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500" />
                  </label>
                  <button type="button" disabled={!selectedDesignerId || !submissionDeadline || selectedSubmissionFiles.length === 0 || assigningDesigner} onClick={assignQuoteToDesigner} className="mt-5 inline-flex h-10 items-center justify-center rounded bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 lg:mt-[19px]">
                    {assigningDesigner ? "Assigning..." : "Assign"}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <input type="file" multiple className="sr-only" onChange={(event) => setSelectedSubmissionFiles(Array.from(event.target.files ?? []))} />
                    Choose upload file
                  </label>
                  <span className="max-w-xs truncate text-xs text-slate-500">{selectedSubmissionFiles.length > 0 ? `${selectedSubmissionFiles.length} file${selectedSubmissionFiles.length === 1 ? "" : "s"} selected` : "No files selected"}</span>
                </div>
                {assignmentMessage ? <p className={`mt-3 text-xs font-semibold ${assignmentMessage.includes("success") ? "text-emerald-600" : "text-rose-500"}`}>{assignmentMessage}</p> : null}
                {activeQuote.assignedDesignerId ? (
                  <div className="mt-4 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-2 lg:grid-cols-3">
                    {assignmentDetails.map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">{label}</p>
                        <p className="mt-1 break-words text-sm font-medium text-slate-800">{formatInfoValue(label === "Submission Deadline" ? "submissionDeadline" : label === "Assigned At" ? "assignedAt" : label, value)}</p>
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

              {submissionUrl && (
                <section className="order-4 mt-6 rounded-md border border-slate-100 bg-slate-50 p-4">

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-950">Designer Submission</h4>
                      <p className="mt-1 break-all text-xs text-slate-500">{submissionFileName}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={submissionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Open
                      </a>
                      <button
                        type="button"
                        onClick={downloadDesignerSubmission}
                        disabled={downloadingSubmission}
                        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {downloadingSubmission ? "Downloading..." : "Download"}
                      </button>
                    </div>
                  </div>

                  {isImage && (
                    <img
                      src={submissionUrl}
                      alt={submissionFileName}
                      className="mt-4 max-h-72 rounded border object-contain"
                    />
                  )}

                  {isPdf && (
                    <iframe
                      src={submissionUrl}
                      className="mt-4 h-[500px] w-full rounded border"
                    />
                  )}

                  {!isImage && !isPdf && (
                    <div className="mt-4 rounded border bg-white p-8 text-center">
                      <p className="font-semibold">
                        Preview is not available for this file type.
                      </p>
                    </div>
                  )}

                </section>
              )}
              <section className="order-2 mt-6 rounded-md border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-bold text-slate-950">Quote Info</h4>
                  <div className="">
                    <button type="button" onClick={() => downloadQuoteInfo(activeQuote)} className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      <Download className="h-3.5 w-3.5" />
                      Download TXT
                    </button>
                    <button type="button" onClick={() => downloadQuoteFiles(activeQuote)} disabled={!Array.isArray(activeQuote.files) || activeQuote.files.length === 0 || downloadingZip} className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                      <Download className="h-3.5 w-3.5" />
                      {downloadingZip ? "Preparing ZIP..." : "Download ZIP"}
                    </button>
                  </div>
                </div>
                {Array.isArray(activeQuote.files) && activeQuote.files.length > 0 ? (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">Files</p>
                    <div className="mt-3 space-y-4">
                      {activeQuote.files.map((file, index) => {
                        const record = asRecord(file);
                        const fileUrl = getStorageFileUrl(file);
                        const label = typeof record?.name === "string" && record.name ? record.name : `File ${index + 1}`;
                        const extension = getFileExtension(file, fileUrl);
                        const isImage = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(extension);
                        const isPdf = extension === "pdf";

                        return (
                          <div key={`${label}-${index}`} className="rounded border border-slate-200 bg-white p-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="break-all text-sm font-medium text-slate-800" title={label}>{label}</p>
                              {fileUrl ? <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50">Open</a> : null}
                            </div>
                            {fileUrl && isImage ? <img src={fileUrl} alt={label} className="mt-4 max-h-72 rounded border object-contain" /> : null}
                            {fileUrl && isPdf ? <iframe src={fileUrl} title={label} className="mt-4 h-[500px] w-full rounded border" /> : null}
                            {fileUrl && !isImage && !isPdf ? <a href={fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-blue-600 underline">Open file</a> : null}
                            {!fileUrl ? <p className="mt-2 text-xs text-slate-500">File URL unavailable.</p> : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(activeQuote)
                    .filter(([key]) => !["id", "fullName", "name", "country", "companyName", "company", "email", "contactNumber", "phone", "files", "submittedAt", "whatsappOptIn", "fabricType", "placementArea", "outputFormatOther", "colorwayToUseOther"].includes(key))
                    .filter(([, value]) => value !== null && value !== undefined && value !== "")
                    .filter(([key]) =>
                      ![
                        "designerSubmission",
                        "designerSubmissionUrl",
                        "designerSubmissionPath",
                        "designerSubmittedAt",
                        "verifiedAt",
                        "assignedAt",
                        "assignmentType",
                        "submissionDeadline",
                        "assignedDesignerId",
                        "assignedDesignerName",
                        "assignedDesignerEmail",
                        "assignmentFiles",
                      ].includes(key)
                    ).sort(([firstKey], [secondKey]) => {
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
                            <div className="mt-2 rounded border border-slate-200 bg-white p-3 text-sm text-slate-700">
                              <span className="font-medium text-slate-800">{value.map((item, index) => {
                                const record = asRecord(item);
                                const fileUrl = getStorageFileUrl(item);
                                const label = typeof record?.name === "string" && record.name ? record.name : `${prettifyKey(key)} ${index + 1}`;
                                return fileUrl ? label : formatInfoValue(key, item);
                              }).filter(Boolean).join(", ")}</span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={key}>
                          <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-400">{prettifyKey(key)}</p>
                          <p className="mt-1 break-words text-sm font-medium text-slate-800">{formatInfoValue(key, value)}</p>
                        </div>
                      );
                    })}
                </div>
              </section>


            </div>

            <div className="border-t border-slate-100 px-5 py-4">
              <button type="button" onClick={() => setActiveQuote(null)} className="rounded border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
