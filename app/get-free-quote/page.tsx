"use client";

import { UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomDropdown } from "../get-quote/components/CustomDropdown";
import { QuoteContactFields } from "../get-quote/components/QuoteContactFields";
import { countryOptions } from "../get-quote/lib/country-options";
import {
  initialGetQouteFormState,
  getQouteFormSchema,
  type GetQouteFormState,
} from "./lib/get-qoute-form";
import {
  isAllowedUploadFile,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_COUNT,
} from "../get-quote/lib/quote-form";
import { useSearchParams } from "next/navigation";

// inside GetQoutePage()

const fieldValidationOrder = [
  "fullName",
  "email",
  "country",
  "contactNumber",
  "orderType",
  "designName",
  "numberOfColors",
  "unitType",
  "width",
  "height",
  "files",
  "whatsappOptIn",
] as const;

const numberOfColorOptions = ["According to Logo"];

const focusInvalidField = (field: string) => {
  const selectorsByField: Record<string, string[]> = {
   if (typeof document === "undefined") return;
    fullName: ["#full-name", "[name='fullName']"],
    email: ["#email", "[name='email']"],
    country: ["#country-input", "[name='country']"],
    contactNumber: ["#phone", "[name='phone']"],
    orderType: ["[name='orderType']"],
    designName: ["#design-name", "[name='designName']"],
    numberOfColors: ["#number-of-colors", "[name='numberOfColors']"],
    unitType: ["[name='unitType']"],
    width: ["#width", "[name='width']"],
    height: ["#height", "[name='height']"],
    files: ["label[for='file-upload']", "#file-upload"],
    whatsappOptIn: ["[name='whatsappOptIn']"],
  };

  const selectors = selectorsByField[field] ?? [`[name='${field}']`, `#${field}`];
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (!element) continue;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    if ("focus" in element) element.focus();
    return;
  }
};

const getFirstErrorField = (errors: Record<string, string>) => {
  const ordered = fieldValidationOrder.find((field) => Boolean(errors[field]));
  if (ordered) return ordered;
  return Object.keys(errors)[0];
};

const toDisplay = (value?: string) =>
  value
    ?.trim()
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") ?? "Not set";

const getCountryName = (countryCode?: string) => {
  const code = countryCode?.trim().toUpperCase();
  if (!code) return "Not set";
  return countryOptions.find((country) => country.code === code)?.name ?? code;
};

export default function GetQoutePage() {
  const [formData, setFormData] = useState<GetQouteFormState>(initialGetQouteFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = typeof window !== "undefined" ? useSearchParams() : null;

  useEffect(() => {
  if (!searchParams) return;

  const orderType = searchParams.get("orderType");
  if (orderType === "embroidery" || orderType === "vector") {
    setFormData((prev) => ({ ...prev, orderType }));
  }
}, [searchParams]);
  const previewFileUrl = useMemo(() => {
    const file = formData.files[0];
    if (!file || !file.type.startsWith("image/")) return "";
    return URL.createObjectURL(file);
  }, [formData.files]);

  useEffect(() => {
    return () => {
      if (previewFileUrl) URL.revokeObjectURL(previewFileUrl);
    };
  }, [previewFileUrl]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setSubmitMessage("");
  };

  const emitFieldChange = (name: keyof GetQouteFormState, value: string) => {
    handleFieldChange({
      target: { name, value, type: "text" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleContactValuesChange = useCallback(({ country, phone }: { country: string; phone: string }) => {
    setFormData((prev) => {
      if (prev.country === country && prev.contactNumber === phone) return prev;
      return {
        ...prev,
        country,
        contactNumber: phone,
      };
    });
    setErrors((prev) => {
      if (!prev.country && !prev.contactNumber) return prev;
      const next = { ...prev };
      delete next.country;
      delete next.contactNumber;
      return next;
    });
  }, []);

  const processIncomingFiles = useCallback((incomingFiles: FileList | null | undefined) => {
    const nextFiles = Array.from(incomingFiles ?? []);
    if (nextFiles.length === 0) return;

    const hasUnsafeFileName = (fileName: string) => /(\.\.)|[<>:"/\\|?*\x00-\x1F]/.test(fileName);
    const videoByExtension = (fileName: string) => /\.(mp4|mov|avi|wmv|mkv|webm|m4v|3gp)$/i.test(fileName);
    const blockedVideoCount = nextFiles.filter(
      (file) => file.type.toLowerCase().startsWith("video/") || videoByExtension(file.name)
    ).length;
    const nonAllowedTypeCount = nextFiles.filter((file) => !isAllowedUploadFile(file)).length;
    const oversizedCount = nextFiles.filter((file) => file.size > MAX_FILE_SIZE_BYTES).length;
    const unsafeNameCount = nextFiles.filter((file) => hasUnsafeFileName(file.name)).length;
    const validFiles = nextFiles.filter(
      (file) => isAllowedUploadFile(file) && file.size <= MAX_FILE_SIZE_BYTES && !hasUnsafeFileName(file.name)
    );

    if (validFiles.length > 0) {
      setFormData((prev) => {
        const merged = [...prev.files, ...validFiles];
        return { ...prev, files: merged.slice(0, MAX_FILES_COUNT) };
      });
    }

    setErrors((prev) => {
      const next = { ...prev };
      if (blockedVideoCount > 0) {
        next.files = "Video files are not allowed.";
      } else if (nonAllowedTypeCount > 0) {
        next.files = "Only images and document/design files are allowed.";
      } else if (oversizedCount > 0) {
        next.files = "Each file must be 50MB or less.";
      } else if (unsafeNameCount > 0) {
        next.files = "One or more file names are invalid.";
      } else if (formData.files.length + validFiles.length > MAX_FILES_COUNT) {
        next.files = `You can upload up to ${MAX_FILES_COUNT} files.`;
      } else if (validFiles.length > 0) {
        delete next.files;
      }
      return next;
    });
    setSubmitMessage("");
  }, [formData.files.length]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processIncomingFiles(e.target.files);
    e.target.value = "";
  };

  const handleFilesDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      processIncomingFiles(e.dataTransfer?.files);
    },
    [processIncomingFiles]
  );

  const handleFileRemove = useCallback((fileIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== fileIndex),
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.files;
      return next;
    });
    setSubmitMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult = getQouteFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const nextErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setErrors(nextErrors);
      const firstErrorField = getFirstErrorField(nextErrors);
      if (firstErrorField) {
        requestAnimationFrame(() => focusInvalidField(firstErrorField));
      }
      return;
    }

    const sanitizedData = {
      ...validationResult.data,
      width: validationResult.data.width?.trim() || (validationResult.data.height?.trim() ? "0" : ""),
      height: validationResult.data.height?.trim() || (validationResult.data.width?.trim() ? "0" : ""),
    };

    void sanitizedData;

    setShowOtp(true);
    setOtpCode("");
    setOtpError("");
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = otpCode.trim();
    if (normalized !== "123456") {
      setOtpError("Invalid code. Please enter 123456.");
      return;
    }
    setShowOtp(false);
    setShowSuccess(true);
    setFormData(initialGetQouteFormState);
    setErrors({});
    setSubmitMessage("Quote submitted successfully.");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const previewWidth = formData.width?.trim() || (formData.height?.trim() ? "proportional" : "");
  const previewHeight = formData.height?.trim() || (formData.width?.trim() ? "proportional" : "");
  const hasDesignSpecSelection = Boolean(
    formData.orderType ||
    formData.designName.trim() ||
    formData.numberOfColors.trim() ||
    formData.unitType ||
    formData.width?.trim() ||
    formData.height?.trim() ||
    formData.additionalNotes?.trim()
  );

  if (showSuccess) {
    return (
      <main className="relative bg-slate-100 px-4 py-20 sm:px-6">
        <section className="relative z-10 mx-auto max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">Submission Successful</h1>
            <p className="mt-3 text-gray-600">We have received your quote request. Our team will get back to you soon.</p>
            <button
              type="button"
              className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              onClick={() => setShowSuccess(false)}
            >
              Submit Another Quote
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative bg-slate-100 px-4 py-14 sm:px-6">
      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Request a Free Quote</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Tell us about your design project. Upload your files, describe your specifications, and we&apos;ll get back to you.
          </p>
        </div>

        <div
          className={
            hasDesignSpecSelection
              ? "grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_380px]"
              : "grid grid-cols-1 items-start gap-6"
          }
        >
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="overflow-visible rounded-lg border border-gray-200 bg-white">
              <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">
                Your Contact Information
              </h2>
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
                    onChange={handleFieldChange}
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
                    onChange={handleFieldChange}
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
                    onChange={handleFieldChange}
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <QuoteContactFields
                    defaultCountry={formData.country}
                    defaultPhone={formData.contactNumber}
                    onValuesChangeAction={handleContactValuesChange}
                  />
                  {errors.contactNumber && <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>}
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">
                Design Specifications
              </h2>
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
                        onChange={handleFieldChange}
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
                        onChange={handleFieldChange}
                        className="sr-only"
                        required
                      />
                      Vector Conversion
                    </label>
                  </div>
                  {errors.orderType && <p className="mt-1 text-sm text-red-600">{errors.orderType}</p>}
                </div>

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
                      onChange={handleFieldChange}
                      required
                    />
                    {errors.designName && <p className="mt-1 text-sm text-red-600">{errors.designName}</p>}
                  </div>

                  <div>
                    <label htmlFor="number-of-colors" className="mb-1 block text-sm font-semibold text-gray-700">
                      Numbers of colors *
                    </label>
                    <CustomDropdown
                      id="number-of-colors"
                      placeholder="Select or type number of color"
                      options={numberOfColorOptions}
                      value={formData.numberOfColors}
                      onSelectAction={(selected) => emitFieldChange("numberOfColors", selected)}
                    />
                    {errors.numberOfColors && <p className="mt-1 text-sm text-red-600">{errors.numberOfColors}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <p className="mb-2 block text-sm font-semibold text-gray-700">Unit Type *</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {["inches", "centimeter", "millimeter"].map((unit) => (
                        <label
                          key={unit}
                          htmlFor={`unit-type-${unit}`}
                          className={`cursor-pointer rounded-md border px-4 py-2 text-center text-sm font-semibold transition-colors ${formData.unitType === unit
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-primary"
                            }`}
                        >
                          <input
                            id={`unit-type-${unit}`}
                            type="radio"
                            name="unitType"
                            value={unit}
                            checked={formData.unitType === unit}
                            onChange={handleFieldChange}
                            className="sr-only"
                            required
                          />
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </label>
                      ))}
                    </div>
                    {errors.unitType && <p className="mt-1 text-sm text-red-600">{errors.unitType}</p>}
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
                      onChange={handleFieldChange}
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
                      onChange={handleFieldChange}
                    />
                    {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
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
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
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
                  onDrop={handleFilesDrop}
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
                    onChange={handleFilesChange}
                    required={formData.files.length === 0}
                  />
                </label>
                {formData.files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {formData.files.map((file, index) => (
                      <li
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="inline-flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                      >
                        <span className="truncate pr-3">{file.name}</span>
                        <button
                          type="button"
                          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                          onClick={() => handleFileRemove(index)}
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
              <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">
                Continue via WhatsApp? *
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
                {errors.whatsappOptIn && <p className="mt-2 text-sm text-red-600">{errors.whatsappOptIn}</p>}
              </div>
            </div>

            {submitMessage && (
              <p className="rounded-md border border-green-200 bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                {submitMessage}
              </p>
            )}

            <button type="submit" className="btn">
              Submit Quote
            </button>
          </form>

          {hasDesignSpecSelection && (
            <aside className="sticky top-6 self-start">
              <div className="rounded-lg border border-gray-200 bg-white">
                <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">Live Preview</h2>
                <div className="space-y-4 p-5">
                  <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                    <div className="flex h-40 items-center justify-center rounded-md border border-gray-200 bg-white">
                      {previewFileUrl ? (
                        <img
                          src={previewFileUrl}
                          alt="Uploaded file preview"
                          className="h-full w-full rounded-md object-contain"
                        />
                      ) : formData.files[0] ? (
                        <p className="break-all px-3 text-sm text-gray-600">{formData.files[0].name}</p>
                      ) : (
                        <p className="text-sm text-gray-600">Quote preview shows here</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-left text-sm">
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">Order Type:</span>
                      <span className="min-w-0 truncate text-gray-600">{toDisplay(formData.orderType)}</span>
                    </p>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">Name:</span>
                      <span className="min-w-0 truncate text-gray-600">{toDisplay(formData.fullName)}</span>
                    </p>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">Company:</span>
                      <span className="min-w-0 truncate text-gray-600">{toDisplay(formData.companyName)}</span>
                    </p>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">Contact:</span>
                      <span className="min-w-0 truncate text-gray-600">{toDisplay(formData.contactNumber)}</span>
                    </p>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">Email:</span>
                      <span className="min-w-0 truncate text-gray-600">{toDisplay(formData.email)}</span>
                    </p>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">Country:</span>
                      <span className="min-w-0 truncate text-gray-600">{getCountryName(formData.country)}</span>
                    </p>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">Design Name:</span>
                      <span className="min-w-0 truncate text-gray-600">{toDisplay(formData.designName)}</span>
                    </p>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">No. of Colors:</span>
                      <span className="min-w-0 truncate text-gray-600">{toDisplay(formData.numberOfColors)}</span>
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm font-semibold text-gray-800">Unit</span>
                      <span className="text-sm font-semibold text-gray-800">Width</span>
                      <span className="text-sm font-semibold text-gray-800">Height</span>
                      <span className="min-w-0 truncate text-sm text-gray-600">{toDisplay(formData.unitType)}</span>
                      <span className="min-w-0 truncate text-sm text-gray-600">{toDisplay(previewWidth)}</span>
                      <span className="min-w-0 truncate text-sm text-gray-600">{toDisplay(previewHeight)}</span>
                    </div>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">WhatsApp:</span>
                      <span className="min-w-0 truncate text-gray-600">{formData.whatsappOptIn ? "Yes" : "No"}</span>
                    </p>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">Notes:</span>
                      <span className="min-w-0 overflow-hidden text-ellipsis break-words text-gray-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]">
                        {toDisplay(formData.additionalNotes)}
                      </span>
                    </p>
                    <p className="grid grid-cols-[120px_minmax(0,1fr)] gap-1">
                      <span className="font-semibold text-gray-800">File:</span>
                      <span className="min-w-0 truncate text-gray-600">{formData.files[0]?.name ?? "Not set"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

      {showOtp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Verify Your Email</h2>
              <button
                type="button"
                className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                onClick={() => setShowOtp(false)}
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">Enter the 6-digit code sent to your email.</p>
            <p className="mt-1 text-xs text-gray-400">Use 123456 for now.</p>
            <form className="mt-4 space-y-3" onSubmit={handleOtpSubmit}>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otpCode}
                onChange={(event) => {
                  setOtpCode(event.target.value.replace(/\D/g, ""));
                  setOtpError("");
                }}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-center text-lg font-semibold tracking-[0.3em] text-gray-900 focus:border-primary focus:outline-none"
                placeholder="123456"
              />
              {otpError && <p className="text-sm text-red-600">{otpError}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Verify &amp; Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}


