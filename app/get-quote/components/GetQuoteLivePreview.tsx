import type { QuoteFormState } from "../lib/quote-form";
import { countryOptions } from "../lib/country-options";

type GetQuoteLivePreviewProps = {
  formData: QuoteFormState;
  previewFileUrl: string;
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

export function GetQuoteLivePreview({ formData, previewFileUrl }: GetQuoteLivePreviewProps) {
  const selectedOutputFormats = formData.outputFormats
    .map((format) => (format === "other" && formData.outputFormatOther?.trim() ? formData.outputFormatOther : format))
    .join(", ");
  const previewWidth = formData.width?.trim() || (formData.height?.trim() ? "proportional" : "");
  const previewHeight = formData.height?.trim() || (formData.width?.trim() ? "proportional" : "");

  return (
    <aside className="sticky top-6 self-start">
      <div className="rounded-lg border border-gray-200 bg-white">
        <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">Live Preview</h2>
        <div className="space-y-4 p-5">
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
            <div className="flex h-40 items-center justify-center rounded-md border border-gray-200 bg-white">
              {previewFileUrl ? (
                <img src={previewFileUrl} alt="Uploaded file preview" className="h-full w-full rounded-md object-contain" />
              ) : formData.files[0] ? (
                <p className="break-all px-3 text-sm text-gray-600">{formData.files[0].name}</p>
              ) : formData.orderType === "embroidery" || formData.orderType === "vector" ? (
                <img
                  src={
                    formData.orderType === "embroidery"
                      ? "/home-page/portfolio-embroidery/2nd.jpg"
                      : "/home-page/portfolio-vector/2nd.jpg"
                  }
                  alt={formData.orderType === "embroidery" ? "Embroidery preview" : "Vector preview"}
                  className="h-full w-full rounded-md object-contain"
                />
              ) : (
                <p className="text-sm text-gray-600">Quote preview show here</p>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm text-left">
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Order Type:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.orderType)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Name:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.fullName)}</span>
            </p>
            <p  className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Company:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.companyName)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Contact:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.contactNumber)}</span>
            </p>
            <p  className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Email:</span> <span className="min-w-0 text-gray-600 truncate">{formData.email}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Country:</span> <span className="min-w-0 text-gray-600 truncate">{getCountryName(formData.country)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Design Name:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.designName)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Turnaround:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.turnaroundTime)}</span>
            </p>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-sm font-semibold text-gray-800">Unit</span>
              <span className="text-sm font-semibold text-gray-800">Width</span>
              <span className="text-sm font-semibold text-gray-800">Height</span>
              <span className="min-w-0 truncate text-sm text-gray-600">{toDisplay(formData.unitSelect)}</span>
              <span className="min-w-0 truncate text-sm text-gray-600">{toDisplay(previewWidth)}</span>
              <span className="min-w-0 truncate text-sm text-gray-600">{toDisplay(previewHeight)}</span>
            </div>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Output Formats:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(selectedOutputFormats)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Fabric:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.fabricType)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Placement:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.placementArea)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Applique:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.appliqueRequired)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Colors:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.colorsName)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">No. of Colors:</span> <span className="min-w-0 text-gray-600 truncate">{toDisplay(formData.numberOfColors)}</span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Colorway:</span>{" "}
              <span className="min-w-0 text-gray-600 truncate">
                {toDisplay(formData.colorwayToUse === "other" ? formData.colorwayToUseOther : formData.colorwayToUse)}
              </span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">Additional Notes:</span>{" "}
              <span className="min-w-0 overflow-hidden text-ellipsis break-words text-gray-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
                {toDisplay(formData.additionalNotes)}
              </span>
            </p>
            <p className="grid grid-cols-[110px_minmax(0,1fr)] gap-1">
              <span className="font-semibold text-gray-800">File:</span> <span className="min-w-0 text-gray-600 truncate">{formData.files[0]?.name}</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
