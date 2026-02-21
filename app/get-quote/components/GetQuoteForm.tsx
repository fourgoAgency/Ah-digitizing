"use client";

import { UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent, KeyboardEvent, RefObject } from "react";
import { CustomDropdown } from "./CustomDropdown";
import { QuoteContactFields } from "./QuoteContactFields";
import {
  colorwayOptions,
  fabricTypes,
  outputFormats,
  placementAreas,
  type QuoteFormState,
} from "../lib/quote-form";

const turnaroundOptions = ["12 to 24 hours", "4 to 8 hours", "1 to 4 hours"] as const;

const parseCustomFormats = (value: string | undefined): string[] => {
  const seen = new Set<string>();
  return (value ?? "")
    .split(/[,\s]+/)
    .map((item) => item.trim().toUpperCase())
    .filter((item) => {
      if (!item) return false;
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const toSlug = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

const parseColorNames = (value: string | undefined): string[] => {
  const seen = new Set<string>();
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => {
      if (!item) return false;
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

type GetQuoteFormProps = {
  formData: QuoteFormState;
  errors: Record<string, string>;
  submitMessage: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFieldChangeAction: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onOutputFormatToggleAction: (format: string) => void;
  onContactValuesChangeAction: (values: { country: string; phone: string }) => void;
  onFilesChangeAction: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilesDropAction: (event: DragEvent<HTMLLabelElement>) => void;
  onFileRemoveAction: (fileIndex: number) => void;
  onSubmitAction: (event: FormEvent<HTMLFormElement>) => void;
};

export function GetQuoteForm({
  formData,
  errors,
  submitMessage,
  fileInputRef,
  onFieldChangeAction,
  onOutputFormatToggleAction,
  onContactValuesChangeAction,
  onFilesChangeAction,
  onFilesDropAction,
  onFileRemoveAction,
  onSubmitAction,
}: GetQuoteFormProps) {
  const [customFormatDraft, setCustomFormatDraft] = useState("");
  const [colorNameDraft, setColorNameDraft] = useState("");
  const hasOtherOutputFormat = formData.outputFormats.includes("other");
  const predefinedFormats = formData.outputFormats.filter((format) => format !== "other");
  const customFormats = useMemo(() => parseCustomFormats(formData.outputFormatOther), [formData.outputFormatOther]);
  const selectedColorNames = useMemo(() => parseColorNames(formData.colorsName), [formData.colorsName]);
  const selectedOutputFormats = useMemo(() => {
    const combined = hasOtherOutputFormat ? [...predefinedFormats, ...customFormats] : [...predefinedFormats];
    const seen = new Set<string>();
    return combined.filter((format) => {
      const key = format.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [customFormats, hasOtherOutputFormat, predefinedFormats]);
  const selectedOutputFormatLookup = useMemo(() => new Set(formData.outputFormats.map((format) => format.toLowerCase())), [formData.outputFormats]);
  const predefinedLookup = useMemo(() => new Set(outputFormats.map((format) => format.toLowerCase())), []);

  const emitFieldChange = (name: string, value: string) => {
    onFieldChangeAction({
      target: { name, value, type: "text" },
    } as ChangeEvent<HTMLInputElement>);
  };

  const updateCustomFormats = (nextCustomFormats: string[]) => {
    const unique = parseCustomFormats(nextCustomFormats.join(","));
    emitFieldChange("outputFormatOther", unique.join(","));
  };

  const addOutputFormatTag = (rawValue: string) => {
    if (!hasOtherOutputFormat) return;
    const normalizedValue = rawValue.trim().toUpperCase();
    if (!normalizedValue) return;
    const normalizedKey = normalizedValue.toLowerCase();

    if (customFormats.some((format) => format.toLowerCase() === normalizedKey)) {
      setCustomFormatDraft("");
      return;
    }

    updateCustomFormats([...customFormats, normalizedValue]);
    setCustomFormatDraft("");
  };

  const removeOutputFormatTag = (formatToRemove: string) => {
    const normalizedKey = formatToRemove.toLowerCase();
    if (predefinedLookup.has(normalizedKey)) {
      const predefinedMatch = outputFormats.find((format) => format.toLowerCase() === normalizedKey);
      if (predefinedMatch && formData.outputFormats.includes(predefinedMatch)) {
        onOutputFormatToggleAction(predefinedMatch);
        return;
      }
    }

    const nextCustomFormats = customFormats.filter((format) => format.toLowerCase() !== normalizedKey);
    updateCustomFormats(nextCustomFormats);
  };

  const handleCustomFormatKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    addOutputFormatTag(customFormatDraft);
  };

  const updateColorNames = (nextColors: string[]) => {
    const unique = parseColorNames(nextColors.join(","));
    emitFieldChange("colorsName", unique.join(", "));
  };

  const addColorNameTag = (rawValue: string) => {
    const normalized = rawValue.trim();
    if (!normalized) return;
    const exists = selectedColorNames.some((item) => item.toLowerCase() === normalized.toLowerCase());
    if (exists) {
      setColorNameDraft("");
      return;
    }
    updateColorNames([...selectedColorNames, normalized]);
    setColorNameDraft("");
  };

  const removeColorNameTag = (colorToRemove: string) => {
    const nextColors = selectedColorNames.filter((item) => item.toLowerCase() !== colorToRemove.toLowerCase());
    updateColorNames(nextColors);
  };

  const handleColorNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    addColorNameTag(colorNameDraft);
  };

  const firstErrorMessage = Object.values(errors)[0];

  return (
    <form className="space-y-6" onSubmit={onSubmitAction} noValidate>
      <div className="overflow-visible rounded-lg border border-gray-200 bg-white">
        <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">Your Contact Information</h2>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <div>
            <label htmlFor="full-name" className="mb-1 block text-sm font-semibold text-gray-700">
              Name *
            </label>
            <input
              id="full-name"
              name="fullName"
              className="input"
              placeholder="eg:John Doe"
              value={formData.fullName}
              onChange={onFieldChangeAction}
              required
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="company-name" className="mb-1 block text-sm font-semibold text-gray-700">
              Company Name
            </label>
            <input
              id="company-name"
              name="companyName"
              className="input"
              placeholder="eg:Your Company Inc."
              value={formData.companyName}
              onChange={onFieldChangeAction}
            />
            {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-gray-700">
              Email *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="input"
              placeholder="eg:john.doe@example.com"
              value={formData.email}
              onChange={onFieldChangeAction}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div className="sm:col-span-2">
            <QuoteContactFields
              defaultCountry={formData.country}
              defaultPhone={formData.contactNumber}
              onValuesChangeAction={onContactValuesChangeAction}

            />
            {errors.contactNumber && <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>}
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">Design Specifications</h2>
        <div className="space-y-4 p-5">
          <div>
            <p className="mb-2 block text-sm font-semibold text-gray-700">Order Type Select *</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                htmlFor="order-type-embroidery"
                className={`cursor-pointer rounded-md border px-4 py-2 text-center text-sm font-semibold transition-colors ${formData.orderType === "embroidery"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-primary"
                  }`}
              >
                <input
                  id="order-type-embroidery"
                  type="radio"
                  name="orderType"
                  value="embroidery"
                  checked={formData.orderType === "embroidery"}
                  onChange={onFieldChangeAction}
                  className="sr-only"
                  required
                />
                Embroidery Digitizing
              </label>
              <label
                htmlFor="order-type-vector"
                className={`cursor-pointer rounded-md border px-4 py-2 text-center text-sm font-semibold transition-colors ${formData.orderType === "vector"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-primary"
                  }`}
              >
                <input
                  id="order-type-vector"
                  type="radio"
                  name="orderType"
                  value="vector"
                  checked={formData.orderType === "vector"}
                  onChange={onFieldChangeAction}
                  className="sr-only"
                  required
                />
                Vector Conversion
              </label>
            </div>
            {errors.orderType && <p className="mt-1 text-sm text-red-600">{errors.orderType}</p>}
          </div>

          {formData.orderType === "embroidery" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="design-name" className="mb-1 block text-sm font-semibold text-gray-700">
                    Design Name *
                  </label>
                  <input
                    id="design-name"
                    name="designName"
                    className="input"
                    placeholder="Enter design name"
                    value={formData.designName}
                    onChange={onFieldChangeAction}
                    required
                  />
                  {errors.designName && <p className="mt-1 text-sm text-red-600">{errors.designName}</p>}
                </div>
                <div>
                  <label htmlFor="turnaround-time" className="mb-1 block text-sm font-semibold text-gray-700">
                    Turnaround Time *
                  </label>
                  <select
                    id="turnaround-time"
                    name="turnaroundTime"
                    className="input h-12"
                    value={formData.turnaroundTime}
                    onChange={onFieldChangeAction}
                    required
                  >
                    <option value="">Select turnaround</option>
                    <option value={turnaroundOptions[0]}>Standard (12-24 Hours)</option>
                    <option value={turnaroundOptions[1]}>Priority (4-8 Hours)</option>
                    <option value={turnaroundOptions[2]}>Express (1-4 Hours)</option>
                  </select>
                  {errors.turnaroundTime && <p className="mt-1 text-sm text-red-600">{errors.turnaroundTime}</p>}
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-2 block text-sm font-semibold text-gray-700">Unit Select *</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {["inches", "centimeter", "millimeter"].map((unit) => (
                      <label
                        key={unit}
                        htmlFor={`unit-select-${unit}`}
                        className={`cursor-pointer rounded-md border px-4 py-2 text-center text-sm font-semibold transition-colors ${formData.unitSelect === unit
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-primary"
                          }`}
                      >
                        <input
                          id={`unit-select-${unit}`}
                          type="radio"
                          name="unitSelect"
                          value={unit}
                          checked={formData.unitSelect === unit}
                          onChange={onFieldChangeAction}
                          className="sr-only"
                          required
                        />
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </label>
                    ))}
                  </div>
                  {errors.unitSelect && <p className="mt-1 text-sm text-red-600">{errors.unitSelect}</p>}
                </div>
                <div>
                  <label htmlFor="width" className="mb-1 block text-sm font-semibold text-gray-700">
                    Width
                  </label>
                  <input
                    id="width"
                    name="width"
                    type="number"
                    step="any"
                    min="0"
                    className="input"
                    placeholder="proportional to height"
                    value={formData.width}
                    onChange={onFieldChangeAction}
                  />
                  {errors.width && <p className="mt-1 text-sm text-red-600">{errors.width}</p>}
                </div>
                <div>
                  <label htmlFor="height" className="mb-1 block text-sm font-semibold text-gray-700">
                    Height
                  </label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    step="any"
                    min="0"
                    className="input"
                    placeholder="eg:proportional to width"
                    value={formData.height}
                    onChange={onFieldChangeAction}
                  />
                  {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Required File Formats *</label>
                  <div className="mb-2 flex min-h-12 flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2">
                    {selectedOutputFormats.map((format) => (
                      <span
                        key={format}
                        className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                      >
                        {format}
                        <button
                          type="button"
                          className="rounded p-0.5 hover:bg-primary/15"
                          aria-label={`Remove ${format}`}
                          onClick={() => removeOutputFormatTag(format)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      id="output-format-other"
                      name="outputFormatOtherDraft"
                      className="min-w-45 flex-1 border-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400"
                      placeholder={hasOtherOutputFormat ? "Type custom format and press space" : "Select 'Other' to type custom format"}
                      value={customFormatDraft}
                      disabled={!hasOtherOutputFormat}
                      onChange={(event) => setCustomFormatDraft(event.target.value)}
                      onKeyDown={handleCustomFormatKeyDown}
                      onBlur={() => {
                        if (!hasOtherOutputFormat) return;
                        if (!customFormatDraft.trim()) return;
                        addOutputFormatTag(customFormatDraft);
                      }}
                    />
                  </div>
                  {!hasOtherOutputFormat && customFormats.length > 0 && (
                    <div className="mb-2 flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Saved custom formats</span>
                      {customFormats.map((format) => (
                        <span
                          key={`saved-${format}`}
                          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {[...outputFormats, "other"].map((format) => {
                      const active = selectedOutputFormatLookup.has(format.toLowerCase());
                      const label = format === "other" ? "Other" : format;
                      return (
                        <button
                          key={format}
                          type="button"
                          className={`rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors ${active
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-primary"
                            }`}
                          onClick={() => {
                            onOutputFormatToggleAction(format);
                            if (format === "other" && active) {
                              setCustomFormatDraft("");
                            }
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.outputFormats && <p className="mt-1 text-sm text-red-600">{errors.outputFormats}</p>}
                  {errors.outputFormatOther && <p className="mt-1 text-sm text-red-600">{errors.outputFormatOther}</p>}
                </div>
                <div>
                  <label htmlFor="fabric-type" className="mb-1 block text-sm font-semibold text-gray-700">
                    Fabric Type *
                  </label>
                  <CustomDropdown
                    id="fabric-type"
                    placeholder="Select fabric type"
                    options={[...fabricTypes]}
                    value={fabricTypes.find((fabric) => toSlug(fabric) === formData.fabricType) ?? ""}
                    onSelectAction={(selected) => emitFieldChange("fabricType", toSlug(selected))}
                  />
                  {errors.fabricType && <p className="mt-1 text-sm text-red-600">{errors.fabricType}</p>}
                </div>
                <div>
                  <label htmlFor="placement-area" className="mb-1 block text-sm font-semibold text-gray-700">
                    Placement Area *
                  </label>
                  <CustomDropdown
                    id="placement-area"
                    placeholder="Select placement area"
                    options={[...placementAreas]}
                    value={placementAreas.find((area) => toSlug(area) === formData.placementArea) ?? ""}
                    onSelectAction={(selected) => emitFieldChange("placementArea", toSlug(selected))}
                  />
                  {errors.placementArea && <p className="mt-1 text-sm text-red-600">{errors.placementArea}</p>}
                </div>
              </div>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="applique-required" className="mb-1 block text-sm font-semibold text-gray-700">
                    Applique Required? *
                  </label>
                  <select
                    id="applique-required"
                    name="appliqueRequired"
                    className="input"
                    value={formData.appliqueRequired}
                    onChange={onFieldChangeAction}
                    required
                  >
                    <option value="default">Default</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {errors.appliqueRequired && <p className="mt-1 text-sm text-red-600">{errors.appliqueRequired}</p>}
                </div>
                <div>
                  <label htmlFor="colors-name" className="mb-1 block text-sm font-semibold text-gray-700">
                    Colors Name *
                  </label>
                  <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2">
                    {selectedColorNames.map((color) => (
                      <span
                        key={color}
                        className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                      >
                        {color}
                        <button
                          type="button"
                          className="rounded p-0.5 hover:bg-primary/15"
                          aria-label={`Remove ${color}`}
                          onClick={() => removeColorNameTag(color)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      id="colors-name"
                      name="colorsNameDraft"
                      type="text"
                      className="min-w-45 flex-1 border-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                      placeholder="Type color and press space"
                      value={colorNameDraft}
                      onChange={(event) => setColorNameDraft(event.target.value)}
                      onKeyDown={handleColorNameKeyDown}
                      onBlur={() => {
                        if (!colorNameDraft.trim()) return;
                        addColorNameTag(colorNameDraft);
                      }}
                    />
                  </div>
                  {errors.colorsName && <p className="mt-1 text-sm text-red-600">{errors.colorsName}</p>}
                </div>
                <div>
                  <label htmlFor="number-of-colors" className="mb-1 block text-sm font-semibold text-gray-700">
                    Numbers of colors *
                  </label>
                  <input
                    id="number-of-colors"
                    name="numberOfColors"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="input"
                    placeholder="According to Logo"
                    value={formData.numberOfColors}
                    onChange={(event) => emitFieldChange("numberOfColors", event.target.value.replace(/\D/g, ""))}
                    required
                  />
                  {errors.numberOfColors && <p className="mt-1 text-sm text-red-600">{errors.numberOfColors}</p>}
                </div>
                <div>
                  <label htmlFor="colorway-to-use" className="mb-1 block text-sm font-semibold text-gray-700">
                    Colorway to use *
                  </label>
                  <CustomDropdown
                    id="colorway-to-use"
                    placeholder="Select colorway"
                    options={[...colorwayOptions]}
                    value={formData.colorwayToUse === "other" ? "" : (formData.colorwayToUse ?? "")}
                    onSelectAction={(selected) => emitFieldChange("colorwayToUse", selected)}
                  />
                  {errors.colorwayToUse && <p className="mt-1 text-sm text-red-600">{errors.colorwayToUse}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="additional-notes" className="mb-1 block text-sm font-semibold text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    id="additional-notes"
                    name="additionalNotes"
                    className="input h-24 resize-none"
                    placeholder="Additional notes or instructions for your quote (optional)"
                    value={formData.additionalNotes || ""}
                    onChange={onFieldChangeAction}
                  />
                </div>
              </div>
            </>
          )}

          {(formData.orderType === "vector") && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


            </div>
          )}

          {!formData.orderType && <p className="text-sm text-gray-500">Select an order type to view relevant fields.</p>}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">File Upload *</h2>
        <div className="p-5">
          <label
            htmlFor="file-upload"
            className="block cursor-pointer rounded-lg border border-dashed border-gray-300 p-10 text-center transition-colors hover:border-primary"
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDrop={onFilesDropAction}
          >
            <UploadCloud className="mx-auto mb-2 text-gray-500" />
            <p className="text-gray-700">Drag &amp; drop your design here, or click to browse</p>
            <p className="mt-1 text-sm text-gray-500">Accepted: JPG, PNG, JPEG, PDF, AI, EPS, SVG, PSD & more</p>
            <p className="mt-1 text-sm text-gray-500">Up to 10 files, max 50MB each.</p>
            <input
              id="file-upload"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.ai,.eps,.ps,.psd,.svg,.emb,.dst,.pes,.ngs,.pxf,.hus,.vp3,.jef,.cnd,.art,.csd,.xxx,.pec,.omf"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={onFilesChangeAction}
              required={formData.files.length === 0}
            />
          </label>
          {formData.files.length > 0 && (
            <ul className="mt-3 space-y-2 col-span-5">
              {formData.files.map((file, index) => (
                <li
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="inline-flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                >
                  <span className="truncate pr-3">{file.name}</span>
                  <button
                    type="button"
                    className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                    onClick={() => onFileRemoveAction(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <span className="mt-2 block">
            <h3 className="font-semibold">Note:</h3>
            <p className="text-sm text-gray-600">
              Have a sample or old design you like? Upload it so we can follow the same style and direction.{" "}
              <Link href="/privacy-policy#file-validation" className="font-semibold text-primary underline">
                Learn more about uploading files
              </Link>
              .
            </p>
          </span>
          
          {errors.files && <p className="mt-2 text-sm text-red-600">{errors.files}</p>}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">Continue via WhatsApp? *</h2>
        <div className="p-5">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="whatsappOptIn"
              checked={formData.whatsappOptIn}
              onChange={onFieldChangeAction}
              required
            />
            I would like to receive updates and discuss my quote via WhatsApp.
          </label>
        </div>
      </div>

      {submitMessage && (
        <p className="rounded-md border border-green-200 bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">{submitMessage}</p>
      )}

      <button type="submit" className="btn">
        Submit Quote
      </button>

      {firstErrorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed left-1/2 top-16 z-[200] w-[min(92vw,760px)] -translate-x-1/2 rounded-lg border-2 border-red-300 bg-red-50 px-6 py-4 text-base font-semibold text-red-800 shadow-xl"
        >
          {firstErrorMessage}
        </div>
      )}
    </form>
  );
}


