"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { z } from "zod";

const outputFormats = ["DST", "PES", "JEF", "EXP", "NGS", "PXF", "CND", "ART", "VP3"];
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
const colorNameOptions = ["White", "Black", "Red", "Yellow"];
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
    unitSelect: z.string().trim().min(1, "Unit select is required."),
    width: z.string().trim().min(1, "Width is required."),
    height: z.string().trim().min(1, "Height is required."),
    appliqueRequired: z.string().trim().min(1, "Applique selection is required."),
    colorsName: z.string().optional(),
    numberOfColors: z.string().trim().min(1, "Number of colors is required."),
    colorwayToUse: z.string().optional(),
    whatsappOptIn: z.boolean(),
    files: z.array(z.instanceof(File)).min(1, "Please upload at least one file."),
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
  whatsappOptIn: false,
  files: [],
};

export default function GetQuotePage() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
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
            turnaroundTime: "",
            placementArea: "",
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
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({ ...prev, files: selectedFiles }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.files;
      return next;
    });
    setSubmitMessage("");
  };

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

    setFormData(initialFormState);
    setErrors({});
    setSubmitMessage("Quote submitted successfully.");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="bg-gray-100 py-14 px-4 sm:px-6">
      <section className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Request a Custom Quote</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Tell us about your custom design project. Upload your files, describe your
            specifications, and we&apos;ll get back to you with a personalized quote.
          </p>
        </div>

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
                    className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-center transition-colors ${
                      formData.orderType === "embroidery"
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
                    className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium text-center transition-colors ${
                      formData.orderType === "vector"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="unit-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Select
                  </label>
                  <select
                    id="unit-select"
                    name="unitSelect"
                    className="input"
                    value={formData.unitSelect}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select unit</option>
                    <option value="inches">Inches</option>
                    <option value="centimeter">Centimeter</option>
                    <option value="millimeter">Millimeter</option>
                  </select>
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
                    Applique Required
                  </label>
                  <select
                    id="applique-required"
                    name="appliqueRequired"
                    className="input"
                    value={formData.appliqueRequired}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {errors.appliqueRequired && <p className="text-sm text-red-600 mt-1">{errors.appliqueRequired}</p>}
                </div>
                <div>
                  <label htmlFor="colors-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Colors Name
                  </label>
                  <select
                    id="colors-name"
                    name="colorsName"
                    className="input"
                    value={formData.colorsName}
                    onChange={handleFieldChange}
                  >
                    <option value="">Select color name</option>
                    {colorNameOptions.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
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
              </div>

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
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFilesChange}
                  required
                />
              </label>
              {formData.files.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">{formData.files.length} file(s) selected</p>
              )}
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
      </section>
    </main>
  );
}
