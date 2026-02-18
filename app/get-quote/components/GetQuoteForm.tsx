"use client";

import { UploadCloud } from "lucide-react";
import type { ChangeEvent, FormEvent, RefObject } from "react";
import { QuoteContactFields } from "./QuoteContactFields";
import {
  colorwayOptions,
  fabricTypes,
  outputFormats,
  placementAreas,
  type QuoteFormState,
} from "../lib/quote-form";

type GetQuoteFormProps = {
  formData: QuoteFormState;
  errors: Record<string, string>;
  submitMessage: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFieldChangeAction: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onOutputFormatToggleAction: (format: string) => void;
  onContactValuesChangeAction: (values: { country: string; phone: string }) => void;
  onFilesChangeAction: (event: ChangeEvent<HTMLInputElement>) => void;
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
  onSubmitAction,
}: GetQuoteFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmitAction}>
      <div className="overflow-visible rounded-lg border border-gray-200 bg-white">
        <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">Your Contact Information</h2>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <div>
            <label htmlFor="full-name" className="mb-1 block text-sm font-semibold text-gray-700">
              Name
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
              Email
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
            <p className="mb-2 block text-sm font-semibold text-gray-700">Order Type Select</p>
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
                    Design Name
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
                    Turnaround Time
                  </label>
                  <select
                    id="turnaround-time"
                    name="turnaroundTime"
                    className="input"
                    value={formData.turnaroundTime}
                    onChange={onFieldChangeAction}
                    required
                  >
                    <option value="">Select turnaround</option>
                    <option value="6-hour-rush">Standard (12–24 Hours)</option>
                    <option value="12-hour-rush"> Priority (4–8 Hours)</option>
                    <option value="24-hour">Express (1–4 Hours)</option>
                  </select>
                  {errors.turnaroundTime && <p className="mt-1 text-sm text-red-600">{errors.turnaroundTime}</p>}
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-2 block text-sm font-semibold text-gray-700">Unit Select</p>
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
                    type="text"
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
                    type="text"
                    className="input"
                    placeholder="eg:proportional to width"
                    value={formData.height}
                    onChange={onFieldChangeAction}
                  />
                  {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Required File Formats</label>
                  <input
                    type="text"
                    name="outputFormats"
                    className="input mb-2"
                    placeholder="Select required output formats"
                    value={formData.outputFormats
                      .map((format) =>
                        format === "other" ? (formData.outputFormatOther?.trim() || "other") : format
                      )
                      .join(", ")}
                    readOnly
                  />
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {outputFormats.map((format) => (
                      <label key={format} className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          name="outputFormats"
                          value={format}
                          checked={formData.outputFormats.includes(format)}
                          onChange={() => onOutputFormatToggleAction(format)}
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
                        onChange={() => onOutputFormatToggleAction("other")}
                        required={formData.outputFormats.length === 0}
                      />
                      Other
                    </label>
                  </div>
                  {errors.outputFormats && <p className="mt-1 text-sm text-red-600">{errors.outputFormats}</p>}
                  {formData.outputFormats.includes("other") && (
                    <div className="mt-3">
                      <label htmlFor="output-format-other" className="mb-1 block text-sm font-semibold text-gray-700">
                        Other Output Format
                      </label>
                      <input
                        id="output-format-other"
                        name="outputFormatOther"
                        className="input"
                        placeholder="Enter output format"
                        value={formData.outputFormatOther}
                        onChange={onFieldChangeAction}
                        required
                      />
                      {errors.outputFormatOther && <p className="mt-1 text-sm text-red-600">{errors.outputFormatOther}</p>}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="fabric-type" className="mb-1 block text-sm font-semibold text-gray-700">
                    Fabric Type
                  </label>
                  <select
                    id="fabric-type"
                    name="fabricType"
                    className="input"
                    value={formData.fabricType}
                    onChange={onFieldChangeAction}
                    required
                  >
                    <option value="">Select fabric type</option>
                    {fabricTypes.map((fabric) => (
                      <option key={fabric} value={fabric.toLowerCase().replace(/\s+/g, "-")}>
                        {fabric}
                      </option>
                    ))}
                  </select>
                  {errors.fabricType && <p className="mt-1 text-sm text-red-600">{errors.fabricType}</p>}
                </div>
                <div>
                  <label htmlFor="placement-area" className="mb-1 block text-sm font-semibold text-gray-700">
                    Placement Area
                  </label>
                  <select
                    id="placement-area"
                    name="placementArea"
                    className="input"
                    value={formData.placementArea}
                    onChange={onFieldChangeAction}
                    required
                  >
                    <option value="">Select placement area</option>
                    {placementAreas.map((area) => (
                      <option key={area} value={area.toLowerCase().replace(/\s+/g, "-")}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.placementArea && <p className="mt-1 text-sm text-red-600">{errors.placementArea}</p>}
                </div>
              </div>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="applique-required" className="mb-1 block text-sm font-semibold text-gray-700">
                    Applique Required?
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
                    Colors Name
                  </label>
                  <input
                    id="colors-name"
                    name="colorsName"
                    type="text"
                    className="input"
                    placeholder="eg:White, Black, Red, Yellow"
                    value={formData.colorsName}
                    onChange={onFieldChangeAction}
                  />
                </div>
                <div>
                  <label htmlFor="number-of-colors" className="mb-1 block text-sm font-semibold text-gray-700">
                    Numbers of colors
                  </label>
                  <input
                    id="number-of-colors"
                    name="numberOfColors"
                    type="text"
                    className="input"
                    placeholder="Number of colors"
                    value={formData.numberOfColors}
                    onChange={onFieldChangeAction}
                    required
                  />
                  {errors.numberOfColors && <p className="mt-1 text-sm text-red-600">{errors.numberOfColors}</p>}
                </div>
                <div>
                  <label htmlFor="colorway-to-use" className="mb-1 block text-sm font-semibold text-gray-700">
                    Colorway to use
                  </label>
                  <select
                    id="colorway-to-use"
                    name="colorwayToUse"
                    className="input"
                    value={formData.colorwayToUse}
                    onChange={onFieldChangeAction}
                  >
                    {colorwayOptions.map((colorway) => (
                      <option key={colorway} value={colorway}>
                        {colorway}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>
                {formData.colorwayToUse === "other" && (
                  <div>
                    <label htmlFor="colorway-to-use-other" className="mb-1 block text-sm font-semibold text-gray-700">
                      Other Colorway
                    </label>
                    <input
                      id="colorway-to-use-other"
                      name="colorwayToUseOther"
                      type="text"
                      className="input"
                      placeholder="Enter colorway"
                      value={formData.colorwayToUseOther || ""}
                      onChange={onFieldChangeAction}
                      required
                    />
                    {errors.colorwayToUseOther && (
                      <p className="mt-1 text-sm text-red-600">{errors.colorwayToUseOther}</p>
                    )}
                  </div>
                )}
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
        <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">File Upload</h2>
        <div className="p-5">
          <label
            htmlFor="file-upload"
            className="block cursor-pointer rounded-lg border border-dashed border-gray-300 p-10 text-center transition-colors hover:border-primary"
          >
            <UploadCloud className="mx-auto mb-2 text-gray-500" />
            <p className="text-gray-700">Drag &amp; drop your design here, or click to browse</p>
            <p className="mt-1 text-sm text-gray-500">Accepted: .JPG, .PNG, .PDF, .AI, .EPS, .SVG, .BMP</p>
            <p className="mt-1 text-sm text-gray-500">Only 1 file, max 50MB.</p>
            <input id="file-upload" type="file" className="hidden" ref={fileInputRef} onChange={onFilesChangeAction} required />
          </label>
          {formData.files.length > 0 && <p className="mt-2 text-sm text-gray-600">{formData.files[0].name}</p>}
          {errors.files && <p className="mt-2 text-sm text-red-600">{errors.files}</p>}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <h2 className="border-b border-gray-200 px-5 py-4 text-xl font-semibold text-primary">Continue via WhatsApp?</h2>
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
    </form>
  );
}
