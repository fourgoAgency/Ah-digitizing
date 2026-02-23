"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GetQuoteForm } from "./components/GetQuoteForm";
import { GetQuoteLivePreview } from "./components/GetQuoteLivePreview";
import {
  MAX_FILES_COUNT,
  MAX_FILE_SIZE_BYTES,
  initialQuoteFormState,
  isAllowedUploadFile,
  quoteFormSchema,
  type QuoteFormState,
} from "./lib/quote-form";

const fieldValidationOrder = [
  "fullName",
  "email",
  "country",
  "contactNumber",
  "orderType",
  "designName",
  "turnaroundTime",
  "unitSelect",
  "width",
  "height",
  "outputFormats",
  "outputFormatOther",
  "fabricType",
  "placementArea",
  "appliqueRequired",
  "colorsName",
  "numberOfColors",
  "colorwayToUse",
  "colorwayToUseOther",
  "files",
  "whatsappOptIn",
] as const;

const focusInvalidField = (field: string) => {
  const selectorsByField: Record<string, string[]> = {
    fullName: ["#full-name", "[name='fullName']"],
    email: ["#email", "[name='email']"],
    country: ["#country-input", "[name='country']"],
    contactNumber: ["#phone", "[name='phone']"],
    orderType: ["[name='orderType']"],
    designName: ["#design-name", "[name='designName']"],
    turnaroundTime: ["#turnaround-time"],
    unitSelect: ["[name='unitSelect']"],
    width: ["#width", "[name='width']"],
    height: ["#height", "[name='height']"],
    outputFormats: ["#output-format-other"],
    outputFormatOther: ["#output-format-other"],
    fabricType: ["#fabric-type"],
    placementArea: ["#placement-area"],
    appliqueRequired: ["#applique-required", "[name='appliqueRequired']"],
    colorsName: ["#colors-name"],
    numberOfColors: ["#number-of-colors", "[name='numberOfColors']"],
    colorwayToUse: ["#colorway-to-use"],
    colorwayToUseOther: ["#colorway-to-use"],
    files: ["label[for='file-upload']", "#file-upload"],
    whatsappOptIn: ["[name='whatsappOptIn']"],
  };

  const selectors = selectorsByField[field] ?? [`[name='${field}']`, `#${field}`];
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (!element) continue;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    if ("focus" in element) {
      element.focus();
    }
    return;
  }
};

const getFirstErrorField = (errors: Record<string, string>) => {
  const ordered = fieldValidationOrder.find((field) => Boolean(errors[field]));
  if (ordered) return ordered;
  return Object.keys(errors)[0];
};

export default function GetQuotePage() {
  const [formData, setFormData] = useState<QuoteFormState>(initialQuoteFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState("");
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
            designName: prev.designName,
            fabricType: prev.fabricType,
            appliqueRequired: prev.appliqueRequired,
            colorwayToUse: prev.colorwayToUse || "Default",
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
            colorwayToUseOther: "",
            additionalNotes: "",
          };
        }
      }

      if (name === "colorwayToUse") {
        return {
          ...prev,
          colorwayToUse: value,
          colorwayToUseOther: value === "other" ? prev.colorwayToUseOther : "",
        };
      }
      if (name === "outputFormatOther") {
        return {
          ...prev,
          outputFormatOther: value.replace(/\s+/g, ",").replace(/,+/g, ",").toUpperCase(),
        };
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
        delete next.colorwayToUseOther;
        delete next.additionalNotes;
        delete next.turnaroundTime;
        delete next.placementArea;
      }
      if (name === "colorwayToUse") {
        delete next.colorwayToUseOther;
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
      const firstErrorField = getFirstErrorField(nextErrors);
      if (firstErrorField) {
        requestAnimationFrame(() => focusInvalidField(firstErrorField));
      }
      return;
    }

    const sanitizedData =
      validationResult.data.orderType === "embroidery"
        ? {
            ...validationResult.data,
            width: validationResult.data.width?.trim() || (validationResult.data.height?.trim() ? "0" : ""),
            height: validationResult.data.height?.trim() || (validationResult.data.width?.trim() ? "0" : ""),
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
            colorwayToUseOther: "",
            additionalNotes: "",
          };

    // TODO: Send sanitizedData to backend API route when endpoint is available.
    void sanitizedData;

    setFormData(initialQuoteFormState);
    setErrors({});
    setSubmitMessage("Quote submitted successfully.");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasOrderType = Boolean(formData.orderType);

  return (
    <main className="relative bg-slate-100 px-4 py-14 sm:px-6">
      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Request a Custom Quote</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Tell us about your custom design project. Upload your files, describe your specifications, and we&apos;ll
            get back to you with a personalized quote.
          </p>
        </div>

        <div
          className={
            hasOrderType
              ? "grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1fr)_380px]"
              : "grid grid-cols-1 items-start gap-6"
          }
        >
          <GetQuoteForm
            formData={formData}
            errors={errors}
            submitMessage={submitMessage}
            fileInputRef={fileInputRef}
            onFieldChangeAction={handleFieldChange}
            onOutputFormatToggleAction={handleOutputFormatToggle}
            onContactValuesChangeAction={handleContactValuesChange}
            onFilesChangeAction={handleFilesChange}
            onFilesDropAction={handleFilesDrop}
            onFileRemoveAction={handleFileRemove}
            onSubmitAction={handleSubmit}
          />
          {hasOrderType && <GetQuoteLivePreview formData={formData} previewFileUrl={previewFileUrl} />}
        </div>
      </section>
    </main>
  );
}
