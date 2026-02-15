"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { z } from "zod";

const outputFormats = ["DST", "PES", "JEF", "EXP", "NGS", "PXF", "CND", "ART", "VP3"];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const placementAreas = ["Cap", "Left Chest", "Jacket Back"];
const fabricTypes = [
  "Beanie",
  "Cotton",
  "Fleece",
  "Jacket",
  "Puffy Jacket",
  "Polo",
  "Polyester",
  "Sweatshirt",
  "Spandex",
];
const colorwayOptions = [
  "Default",
  "Gunold Poly 40",
  "Gunold Poly 60",
  "Isacord 30",
  "Isacord 40",
  "Madeira Classic 40",
  "Madeira Polyneon 40",
];

const quoteFormSchema = z
  .object({
    fullName: z.string().trim().min(1, "Name is required."),
    companyName: z.string().trim().min(1, "Company name is required."),
    contactNumber: z.string().trim().min(1, "Contact number is required."),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    country: z.string().trim().min(1, "Country is required."),
    orderType: z.string(),
    designName: z.string().optional(),
    fabricType: z.string().optional(),
    turnaroundTime: z.string().optional(),
    placementArea: z.string().optional(),
    outputFormatOther: z.string().optional(),
    outputFormats: z.array(z.string()),
    unitSelect: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    appliqueRequired: z.string().optional(),
    colorsName: z.string().optional(),
    numberOfColors: z.string().optional(),
    colorwayToUse: z.string().optional(),
    additionalNotes: z.string().optional(),
    whatsappOptIn: z.boolean(),
    files: z
      .array(z.instanceof(File))
      .min(1, "Please upload one file.")
      .max(1, "Only 1 file is allowed.")
      .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE_BYTES), "File size must be 50MB or less."),
  })
  .superRefine((data, ctx) => {
    if (!["embroidery", "vector"].includes(data.orderType)) {
      ctx.addIssue({
        code: "custom",
        path: ["orderType"],
        message: "Order type is required.",
      });
      return;
    }

    if (data.orderType === "embroidery") {
      if (!data.designName?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["designName"],
          message: "Design name is required.",
        });
      }
      if (!data.fabricType) {
        ctx.addIssue({
          code: "custom",
          path: ["fabricType"],
          message: "Fabric type is required.",
        });
      }
      if (data.outputFormats.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["outputFormats"],
          message: "Select at least one required file format.",
        });
      }
      if (!data.unitSelect?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["unitSelect"],
          message: "Unit select is required.",
        });
      }
      if (!data.width?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["width"],
          message: "Width is required.",
        });
      }
      if (!data.height?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["height"],
          message: "Height is required.",
        });
      }
      if (!data.appliqueRequired?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["appliqueRequired"],
          message: "Applique selection is required.",
        });
      }
      if (!data.numberOfColors?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["numberOfColors"],
          message: "Number of colors is required.",
        });
      }
      if (data.outputFormats.includes("other") && !data.outputFormatOther?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["outputFormatOther"],
          message: "Please enter the output format.",
        });
      }
    }

    if (data.orderType === "vector") {
      if (!data.turnaroundTime) {
        ctx.addIssue({
          code: "custom",
          path: ["turnaroundTime"],
          message: "Turnaround time is required.",
        });
      }
      if (!data.placementArea) {
        ctx.addIssue({
          code: "custom",
          path: ["placementArea"],
          message: "Placement area is required.",
        });
      }

    }
  });

type FormState = z.infer<typeof quoteFormSchema>;

const initialFormState: FormState = {
  fullName: "",
  companyName: "",
  contactNumber: "",
  email: "",
  country: "",
  orderType: "",
  designName: "",
  fabricType: "",
  turnaroundTime: "",
  placementArea: "",
  outputFormatOther: "",
  outputFormats: [],
  unitSelect: "",
  width: "",
  height: "",
  appliqueRequired: "",
  colorsName: "",
  numberOfColors: "",
  colorwayToUse: "",
  additionalNotes: "",
  whatsappOptIn: false,
  files: [],
};

export default function GetQuotePage() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : false;

    setFormData((prev) => {
      if (name === "orderType") {
        if (value === "embroidery") {
          return {
            ...prev,
            orderType: value,
            turnaroundTime: "",
            placementArea: "",
            designName: prev.designName,
            fabricType: prev.fabricType,
          };
        }
        if (value === "vector") {
          return {
            ...prev,
            orderType: value,
            designName: "",
            fabricType: "",
            outputFormatOther: "",
            outputFormats: [],
            unitSelect: "",
            width: "",
            height: "",
            appliqueRequired: "",
            colorsName: "",
            numberOfColors: "",
            colorwayToUse: "",
            additionalNotes: "",
          };
        }
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });

    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      if (name === "orderType") {
        delete next.designName;
        delete next.fabricType;
        delete next.outputFormats;
        delete next.outputFormatOther;
        delete next.unitSelect;
        delete next.width;
        delete next.height;
        delete next.appliqueRequired;
        delete next.colorsName;
        delete next.numberOfColors;
        delete next.colorwayToUse;
        delete next.additionalNotes;
        delete next.turnaroundTime;
        delete next.placementArea;
      }
      return next;
    });
    setSubmitMessage("");
  };

  const handleOutputFormatToggle = (format: string) => {
    setFormData((prev) => {
      const exists = prev.outputFormats.includes(format);
      const nextOutputFormats = exists
        ? prev.outputFormats.filter((item) => item !== format)
        : [...prev.outputFormats, format];
      return {
        ...prev,
        outputFormats: nextOutputFormats,
        outputFormatOther: nextOutputFormats.includes("other") ? prev.outputFormatOther : "",
      };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.outputFormats;
      delete next.outputFormatOther;
      return next;
    });
    setSubmitMessage("");
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const selectedFiles = selectedFile ? [selectedFile] : [];
    setFormData((prev) => ({ ...prev, files: selectedFiles }));
    setErrors((prev) => {
      const next = { ...prev };
      if (selectedFile && selectedFile.size > MAX_FILE_SIZE_BYTES) {
        next.files = "File size must be 50MB or less.";
      } else {
        delete next.files;
      }
      return next;
    });
    setSubmitMessage("");
  };

  useEffect(() => {
    const file = formData.files[0];
    if (!file || !file.type.startsWith("image/")) {
      setPreviewFileUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewFileUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.files]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult = quoteFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const nextErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    const sanitizedData =
      validationResult.data.orderType === "embroidery"
        ? {
            ...validationResult.data,
            turnaroundTime: "",
            placementArea: "",
          }
        : {
            ...validationResult.data,
            designName: "",
            fabricType: "",
            outputFormatOther: "",
            outputFormats: [],
            unitSelect: "",
            width: "",
            height: "",
            appliqueRequired: "",
            colorsName: "",
            numberOfColors: "",
            colorwayToUse: "",
            additionalNotes: "",
          };

    // TODO: Send sanitizedData to backend API route when endpoint is available.
    void sanitizedData;

    setFormData(initialFormState);
    setErrors({});
    setSubmitMessage("Quote submitted successfully.");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasText = (value?: string) => Boolean(value?.trim());

  const toDisplay = (value?: string) =>
    value
      ?.trim()
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") ?? "Not set";

  const selectedOutputFormats = formData.outputFormats
    .map((format) => (format === "other" && formData.outputFormatOther?.trim() ? formData.outputFormatOther : format))
    .join(", ");

  return (
    <main className="relative bg-slate-100 py-14 px-4 sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 h-full w-full text-primary/20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <g id="tool-scissor" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="7" r="2.5" />
              <circle cx="13" cy="7" r="2.5" />
              <path d="M8.8 8.8 16 16M11.2 8.8 4 16" />
            </g>
            <g id="tool-ruler" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <rect x="2" y="4" width="16" height="6" rx="1.2" />
              <path d="M5 6v2M8 6v2M11 6v2M14 6v2M17 6v2" />
            </g>
            <g id="tool-spool" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4h8M6 16h8M5 6h10v8H5z" />
              <path d="M7 8h6M7 10h6M7 12h6" />
            </g>
            <g id="tool-machine" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 13h14v3H3zM4 9h7V5h3l2 2v6M9 9v4M6 13V9" />
            </g>
            <g id="tool-pin" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 13a6 6 0 1 1 12 0z" />
              <path d="M7 10.5v-2M10 10v-3M13 10.5v-2" />
              <circle cx="7" cy="7.5" r=".7" fill="currentColor" />
              <circle cx="10" cy="6.5" r=".7" fill="currentColor" />
              <circle cx="13" cy="7.5" r=".7" fill="currentColor" />
            </g>
            <g id="tool-needle" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15 15 4M12.5 6.5l2 2M3.5 14.5c2 0 2.5 1.5 4.5 1.5" />
            </g>
            <pattern id="sewing-pattern" width="420" height="420" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
              <use href="#tool-machine" transform="translate(28 30) scale(1.9)" />
              <use href="#tool-scissor" transform="translate(210 56) scale(1.9)" />
              <use href="#tool-ruler" transform="translate(318 38) scale(1.9)" />
              <use href="#tool-pin" transform="translate(86 228) scale(1.9)" />
              <use href="#tool-needle" transform="translate(282 246) scale(1.9)" />
              <use href="#tool-spool" transform="translate(184 340) scale(1.9)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sewing-pattern)" />
        </svg>
      </div>
      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Request a Custom Quote</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Tell us about your custom design project. Upload your files, describe your
            specifications, and we&apos;ll get back to you with a personalized quote.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <h2 className="px-5 py-4 text-xl font-semibold text-primary border-b border-gray-200">
              Your Contact Information
            </h2>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="full-name"
                  name="fullName"
                  className="input"
                  placeholder="eg:John Doe"
                  value={formData.fullName}
                  onChange={handleFieldChange}
                  required
                />
                {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  id="company-name"
                  name="companyName"
                  className="input"
                  placeholder="eg:Your Company Inc."
                  value={formData.companyName}
                  onChange={handleFieldChange}
                  required
                />
                {errors.companyName && <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  id="contact-number"
                  name="contactNumber"
                  className="input"
                  placeholder="eg:+1 (555) 123-4567"
                  value={formData.contactNumber}
                  onChange={handleFieldChange}
                  required
                />
                {errors.contactNumber && <p className="text-sm text-red-600 mt-1">{errors.contactNumber}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="input"
                  placeholder="eg:john.doe@example.com"
                  value={formData.email}
                  onChange={handleFieldChange}
                  required
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  className="input"
                  placeholder="eg:United States"
                  value={formData.country}
                  onChange={handleFieldChange}
                  required
                />
                {errors.country && <p className="text-sm text-red-600 mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <h2 className="px-5 py-4 text-xl font-semibold text-primary border-b border-gray-200">
              Design Specifications
            </h2>

            <div className="p-5 space-y-4">
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">Order Type Select</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    htmlFor="order-type-embroidery"
                    className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-center transition-colors ${formData.orderType === "embroidery"
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
                      onChange={handleFieldChange}
                      className="sr-only"
                      required
                    />
                    Embroidery Digitizing
                  </label>
                  <label
                    htmlFor="order-type-vector"
                    className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-center transition-colors ${formData.orderType === "vector"
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
                      onChange={handleFieldChange}
                      className="sr-only"
                      required
                    />
                    Vector Conversion
                  </label>
                </div>
                {errors.orderType && <p className="text-sm text-red-600 mt-1">{errors.orderType}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.orderType === "embroidery" && (
                  <>
                    <div>
                      <label htmlFor="design-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Design Name
                      </label>
                      <input
                        id="design-name"
                        name="designName"
                        className="input"
                        placeholder="Design title"
                        value={formData.designName}
                        onChange={handleFieldChange}
                        required
                      />
                      {errors.designName && <p className="text-sm text-red-600 mt-1">{errors.designName}</p>}
                    </div>
                    <div>
                      <label htmlFor="fabric-type" className="block text-sm font-medium text-gray-700 mb-1">
                        Fabric Type
                      </label>
                      <select
                        id="fabric-type"
                        name="fabricType"
                        className="input"
                        value={formData.fabricType}
                        onChange={handleFieldChange}
                        required
                      >
                        <option value="">Select fabric type</option>
                        {fabricTypes.map((fabric) => (
                          <option key={fabric} value={fabric.toLowerCase().replace(/\s+/g, "-")}>
                            {fabric}
                          </option>
                        ))}
                      </select>
                      {errors.fabricType && <p className="text-sm text-red-600 mt-1">{errors.fabricType}</p>}
                    </div>
                    <div>
                      <label htmlFor="turnaround" className="block text-sm font-medium text-gray-700 mb-1">
                        Turnaround Time
                      </label>
                      <select
                        id="turnaround"
                        name="turnaroundTime"
                        className="input"
                        value={formData.turnaroundTime}
                        onChange={handleFieldChange}
                        required
                      >
                        <option value="">Select turnaround</option>
                        <option value="standard-12-24">Standard (12-24 Hours)</option>
                        <option value="priority-4-8">Priority (4-8 Hours)</option>
                        <option value="express-1-4">Express (1-4 Hours)</option>
                      </select>
                      {errors.turnaroundTime && <p className="text-sm text-red-600 mt-1">{errors.turnaroundTime}</p>}
                    </div>
                    <div>
                      <label htmlFor="placement-area" className="block text-sm font-medium text-gray-700 mb-1">
                        Placement Area
                      </label>
                      <select
                        id="placement-area"
                        name="placementArea"
                        className="input"
                        value={formData.placementArea}
                        onChange={handleFieldChange}
                        required
                      >
                        <option value="">Select placement area</option>
                        {placementAreas.map((area) => (
                          <option key={area} value={area.toLowerCase().replace(/\s+/g, "-")}>
                            {area}
                          </option>
                        ))}
                      </select>
                      {errors.placementArea && <p className="text-sm text-red-600 mt-1">{errors.placementArea}</p>}
                    </div>
                  </>
                )}

                {formData.orderType === "vector" && (
                  <>
                    <div>
                      <label htmlFor="turnaround" className="block text-sm font-medium text-gray-700 mb-1">
                        Turnaround Time
                      </label>
                      <select
                        id="turnaround"
                        name="turnaroundTime"
                        className="input"
                        value={formData.turnaroundTime}
                        onChange={handleFieldChange}
                        required
                      >
                        <option value="">Select turnaround</option>
                        <option value="standard-12-24">Standard (12-24 Hours)</option>
                        <option value="priority-4-8">Priority (4-8 Hours)</option>
                        <option value="express-1-4">Express (1-4 Hours)</option>
                      </select>
                      {errors.turnaroundTime && <p className="text-sm text-red-600 mt-1">{errors.turnaroundTime}</p>}
                    </div>
                    <div>
                      <label htmlFor="placement-area" className="block text-sm font-medium text-gray-700 mb-1">
                        Placement Area
                      </label>
                      <select
                        id="placement-area"
                        name="placementArea"
                        className="input"
                        value={formData.placementArea}
                        onChange={handleFieldChange}
                        required
                      >
                        <option value="">Select placement area</option>
                        {placementAreas.map((area) => (
                          <option key={area} value={area.toLowerCase().replace(/\s+/g, "-")}>
                            {area}
                          </option>
                        ))}
                      </select>
                      {errors.placementArea && <p className="text-sm text-red-600 mt-1">{errors.placementArea}</p>}
                    </div>
                  </>
                )}
              </div>

              {formData.orderType === "embroidery" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required File Formats</label>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {outputFormats.map((format) => (
                      <label key={format} className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          name="outputFormats"
                          value={format}
                          checked={formData.outputFormats.includes(format)}
                          onChange={() => handleOutputFormatToggle(format)}
                          required={formData.outputFormats.length === 0}
                        />
                        {format}
                      </label>
                    ))}
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        name="outputFormats"
                        value="other"
                        checked={formData.outputFormats.includes("other")}
                        onChange={() => handleOutputFormatToggle("other")}
                        required={formData.outputFormats.length === 0}
                      />
                      Other
                    </label>
                  </div>
                  {errors.outputFormats && <p className="text-sm text-red-600 mt-1">{errors.outputFormats}</p>}
                  {formData.outputFormats.includes("other") && (
                    <div className="mt-3">
                      <label htmlFor="output-format-other" className="block text-sm font-medium text-gray-700 mb-1">
                        Other Output Format
                      </label>
                      <input
                        id="output-format-other"
                        name="outputFormatOther"
                        className="input"
                        placeholder="Enter output format"
                        value={formData.outputFormatOther}
                        onChange={handleFieldChange}
                        required
                      />
                      {errors.outputFormatOther && (
                        <p className="text-sm text-red-600 mt-1">{errors.outputFormatOther}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Unit Select Section */}
              {formData.orderType === "embroidery" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <p className="block text-sm font-medium text-gray-700 mb-2">Unit Select</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label
                      htmlFor="unit-select-inches"
                      className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-center transition-colors ${
                        formData.unitSelect === "inches"
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-primary"
                      }`}
                    >
                      <input
                        id="unit-select-inches"
                        type="radio"
                        name="unitSelect"
                        value="inches"
                        checked={formData.unitSelect === "inches"}
                        onChange={handleFieldChange}
                        className="sr-only"
                        required
                      />
                      Inches
                    </label>
                    <label
                      htmlFor="unit-select-centimeter"
                      className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-center transition-colors ${
                        formData.unitSelect === "centimeter"
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-primary"
                      }`}
                    >
                      <input
                        id="unit-select-centimeter"
                        type="radio"
                        name="unitSelect"
                        value="centimeter"
                        checked={formData.unitSelect === "centimeter"}
                        onChange={handleFieldChange}
                        className="sr-only"
                        required
                      />
                      Centimeter
                    </label>
                    <label
                      htmlFor="unit-select-millimeter"
                      className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-center transition-colors ${
                        formData.unitSelect === "millimeter"
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-primary"
                      }`}
                    >
                      <input
                        id="unit-select-millimeter"
                        type="radio"
                        name="unitSelect"
                        value="millimeter"
                        checked={formData.unitSelect === "millimeter"}
                        onChange={handleFieldChange}
                        className="sr-only"
                        required
                      />
                      Millimeter
                    </label>
                  </div>
                  {errors.unitSelect && <p className="text-sm text-red-600 mt-1">{errors.unitSelect}</p>}
                </div>
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                    Width
                  </label>
                  <input
                    id="width"
                    name="width"
                    type="text"
                    className="input"
                    placeholder="proportional to height"
                    value={formData.width}
                    onChange={handleFieldChange}
                    required
                  />
                  {errors.width && <p className="text-sm text-red-600 mt-1">{errors.width}</p>}
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height
                  </label>
                  <input
                    id="height"
                    name="height"
                    type="text"
                    className="input"
                    placeholder="eg:proportional to width"
                    value={formData.height}
                    onChange={handleFieldChange}
                    required
                  />
                  {errors.height && <p className="text-sm text-red-600 mt-1">{errors.height}</p>}
                </div>
                <div>
                  <label htmlFor="applique-required" className="block text-sm font-medium text-gray-700 mb-1">
                    Applique Required?
                  </label>
                  <select
                    id="applique-required"
                    name="appliqueRequired"
                    className="input"
                    value={formData.appliqueRequired}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Defualt</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {errors.appliqueRequired && <p className="text-sm text-red-600 mt-1">{errors.appliqueRequired}</p>}
                </div>
                <div>
                  <label htmlFor="colors-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Colors Name
                  </label>
                  <input
                    id="colors-name"
                    name="colorsName"
                    type="text"
                    className="input"
                    placeholder={`eg:White, Black, Red, Yellow`}
                    value={formData.colorsName}
                    onChange={handleFieldChange}
                  />
                </div>
                <div>
                  <label htmlFor="number-of-colors" className="block text-sm font-medium text-gray-700 mb-1">
                    Numbers of colors
                  </label>
                  <input
                    id="number-of-colors"
                    name="numberOfColors"
                    type="text"
                    className="input"
                    placeholder="Number of colors"
                    value={formData.numberOfColors}
                    onChange={handleFieldChange}
                    required
                  />
                  {errors.numberOfColors && <p className="text-sm text-red-600 mt-1">{errors.numberOfColors}</p>}
                </div>
                <div>
                  <label htmlFor="colorway-to-use" className="block text-sm font-medium text-gray-700 mb-1">
                    Colorway to use
                  </label>
                  <select
                    id="colorway-to-use"
                    name="colorwayToUse"
                    className="input"
                    value={formData.colorwayToUse}
                    onChange={handleFieldChange}
                  >
                    <option value="">Select colorway</option>
                    {colorwayOptions.map((colorway) => (
                      <option key={colorway} value={colorway}>
                        {colorway}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="additional-notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    className="input h-24 resize-none"
                    placeholder="Additional notes or instructions for your quote (optional)"
                    value={formData.additionalNotes || ""}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
              )}
              {!formData.orderType && (
                <p className="text-sm text-gray-500">
                  Select an order type to view relevant fields.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <h2 className="px-5 py-4 text-xl font-semibold text-primary border-b border-gray-200">File Upload</h2>
            <div className="p-5">
              <label
                htmlFor="file-upload"
                className="block rounded-lg border border-dashed border-gray-300 p-10 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <UploadCloud className="mx-auto text-gray-500 mb-2" />
                <p className="text-gray-700">Drag &amp; drop your design here, or click to browse</p>
                <p className="text-sm text-gray-500 mt-1">Accepted: .JPG, .PNG, .PDF, .AI, .EPS, .SVG, .BMP</p>
                <p className="text-sm text-gray-500 mt-1">Only 1 file, max 50MB.</p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFilesChange}
                  required
                />
              </label>
              {formData.files.length > 0 && <p className="text-sm text-gray-600 mt-2">{formData.files[0].name}</p>}
              {errors.files && <p className="text-sm text-red-600 mt-2">{errors.files}</p>}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <h2 className="px-5 py-4 text-xl font-semibold text-primary border-b border-gray-200">
              Continue via WhatsApp?
            </h2>
            <div className="p-5">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="whatsappOptIn"
                  checked={formData.whatsappOptIn}
                  onChange={handleFieldChange}
                  required
                />
                I would like to receive updates and discuss my quote via WhatsApp.
              </label>
            </div>
          </div>

          {submitMessage && (
            <p className="text-sm font-medium text-green-700 bg-green-100 border border-green-200 rounded-md px-3 py-2">
              {submitMessage}
            </p>
          )}

            <button type="submit" className="btn">
              Submit Quote
            </button>
          </form>

          <aside className="self-start sticky top-6">
            <div className="rounded-lg border border-gray-200 bg-white">
              <h2 className="px-5 py-4 text-xl font-semibold text-primary border-b border-gray-200">
                Live Preview
              </h2>
              <div className="p-5 space-y-4">
                <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Quote Preview</p>
                  <div className="mt-3 h-40 rounded-md border border-gray-200 bg-white flex items-center justify-center">
                    {previewFileUrl ? (
                      <img src={previewFileUrl} alt="Uploaded file preview" className="h-full w-full object-contain rounded-md" />
                    ) : formData.files[0] ? (
                      <p className="text-sm text-gray-600 px-3 break-all">{formData.files[0].name}</p>
                    ) : formData.orderType === "embroidery" || formData.orderType === "vector" ? (
                      <img
                        src={
                          formData.orderType === "embroidery"
                            ? "/home-page/portfolio-embroidery/2nd.jpg"
                            : "/home-page/portfolio-vector/2nd.jpg"
                        }
                        alt={formData.orderType === "embroidery" ? "Embroidery preview" : "Vector preview"}
                        className="h-full w-full object-contain rounded-md"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">Quote preview show here</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-800">Order Type:</span> <span className="text-gray-600">{toDisplay(formData.orderType)}</span></p>
                  <p><span className="font-medium text-gray-800">Name:</span> <span className="text-gray-600">{toDisplay(formData.fullName)}</span></p>
                  <p><span className="font-medium text-gray-800">Company:</span> <span className="text-gray-600">{toDisplay(formData.companyName)}</span></p>
                  <p><span className="font-medium text-gray-800">Contact:</span> <span className="text-gray-600">{toDisplay(formData.contactNumber)}</span></p>
                  <p><span className="font-medium text-gray-800">Email:</span> <span className="text-gray-600">{toDisplay(formData.email)}</span></p>
                  <p><span className="font-medium text-gray-800">Country:</span> <span className="text-gray-600">{toDisplay(formData.country)}</span></p>
                  <p><span className="font-medium text-gray-800">Design Name:</span> <span className="text-gray-600">{toDisplay(formData.designName)}</span></p>
                  <p><span className="font-medium text-gray-800">Fabric:</span> <span className="text-gray-600">{toDisplay(formData.fabricType)}</span></p>
                  <p><span className="font-medium text-gray-800">Turnaround:</span> <span className="text-gray-600">{toDisplay(formData.turnaroundTime)}</span></p>
                  <p><span className="font-medium text-gray-800">Placement:</span> <span className="text-gray-600">{toDisplay(formData.placementArea)}</span></p>
                  <p><span className="font-medium text-gray-800">Unit:</span> <span className="text-gray-600">{toDisplay(formData.unitSelect)}</span></p>
                  <p><span className="font-medium text-gray-800">Width:</span> <span className="text-gray-600">{toDisplay(formData.width)}</span></p>
                  <p><span className="font-medium text-gray-800">Height:</span> <span className="text-gray-600">{toDisplay(formData.height)}</span></p>
                  <p><span className="font-medium text-gray-800">Applique:</span> <span className="text-gray-600">{toDisplay(formData.appliqueRequired)}</span></p>
                  <p><span className="font-medium text-gray-800">Colors:</span> <span className="text-gray-600">{toDisplay(formData.colorsName)}</span></p>
                  <p><span className="font-medium text-gray-800">No. of Colors:</span> <span className="text-gray-600">{toDisplay(formData.numberOfColors)}</span></p>
                  <p><span className="font-medium text-gray-800">Colorway:</span> <span className="text-gray-600">{toDisplay(formData.colorwayToUse)}</span></p>
                  <p><span className="font-medium text-gray-800">Output Formats:</span> <span className="text-gray-600">{toDisplay(selectedOutputFormats)}</span></p>
                  <p><span className="font-medium text-gray-800">Additional Notes:</span> <span className="text-gray-600">{toDisplay(formData.additionalNotes)}</span></p>
                  <p><span className="font-medium text-gray-800">File:</span> <span className="text-gray-600">{formData.files[0]?.name }</span></p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}





