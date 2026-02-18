"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GetQuoteBackground } from "./components/GetQuoteBackground";
import { GetQuoteForm } from "./components/GetQuoteForm";
import { GetQuoteLivePreview } from "./components/GetQuoteLivePreview";
import {
  MAX_FILE_SIZE_BYTES,
  initialQuoteFormState,
  quoteFormSchema,
  type QuoteFormState,
} from "./lib/quote-form";

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
            appliqueRequired: prev.appliqueRequired || "default",
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
            appliqueRequired: "default",
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
            appliqueRequired: "default",
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
      <GetQuoteBackground />
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
            onSubmitAction={handleSubmit}
          />
          {hasOrderType && <GetQuoteLivePreview formData={formData} previewFileUrl={previewFileUrl} />}
        </div>
      </section>
    </main>
  );
}
