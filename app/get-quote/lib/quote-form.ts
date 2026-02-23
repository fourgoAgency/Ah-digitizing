import { z } from "zod";
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import { countryOptions } from "./country-options";

export const outputFormats = ["DST", "PES", "JEF", "EXP", "OFM", "XXX", "CSD", "HUS", "CND", "ART", "VP3", "NGS", "PXF"] as const;
export const placementAreas = ["Cap", "Left Chest", "Jacket Back"] as const;
export const fabricTypes = [
  "Beanie",
  "Cotton",
  "Fleece",
  "Jacket",
  "Puffy Jacket",
  "Polo",
  "Polyester",
  "Sweatshirt",
  "Spandex",
] as const;
export const colorwayOptions = [
  "Default",
  "Gunold Poly 40",
  "Gunold Poly 60",
  "Isacord 30",
  "Isacord 40",
  "Madeira Classic 40",
  "Madeira Polyneon 40",
] as const;

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
export const MAX_FILES_COUNT = 10;
export const ALLOWED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/postscript",
  "application/illustrator",
  "application/eps",
  "application/x-eps",
  "application/photoshop",
  "application/x-photoshop",
  "image/vnd.adobe.photoshop",
  "image/svg+xml",
] as const;
export const ALLOWED_UPLOAD_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
  ".webp",
  ".svg",
  ".pdf",
  ".doc",
  ".docx",
  ".ai",
  ".eps",
  ".ps",
  ".psd",
  ".emb",
  ".dst",
  ".pes",
  ".ngs",
  ".pxf",
  ".hus",
  ".vp3",
  ".jef",
  ".cnd",
  ".art",
  ".csd",
  ".xxx",
  ".pec",
  ".ofm",
] as const;

const hasUnsafeFileName = (fileName: string) => /(\.\.)|[<>:"/\\|?*\x00-\x1F]/.test(fileName);
const hasAllowedExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) return false;
  const extension = fileName.slice(lastDotIndex).toLowerCase();
  return ALLOWED_UPLOAD_EXTENSIONS.includes(extension as (typeof ALLOWED_UPLOAD_EXTENSIONS)[number]);
};

export const isAllowedUploadFile = (file: File) => {
  const mimeType = file.type.toLowerCase();
  if (mimeType.startsWith("video/")) return false;
  if (mimeType.startsWith("image/")) return true;
  if (ALLOWED_UPLOAD_MIME_TYPES.includes(mimeType as (typeof ALLOWED_UPLOAD_MIME_TYPES)[number])) return true;
  return hasAllowedExtension(file.name);
};

export const quoteFormSchema = z
  .object({
    fullName: z.string().trim().min(1, "Name is required."),
    companyName: z.string().trim().optional(),
    contactNumber: z.string().trim().optional(),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    country: z.string().trim().min(1, "Select your country."),
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
    colorwayToUseOther: z.string().optional(),
    additionalNotes: z.string().optional(),
    whatsappOptIn: z.boolean(),
    files: z
      .array(z.instanceof(File))
      .min(1, "Please upload one file.")
      .max(MAX_FILES_COUNT, `You can upload up to ${MAX_FILES_COUNT} files.`)
      .refine((files) => files.every((file) => isAllowedUploadFile(file)), "Only images and document/design files are allowed. Videos are blocked.")
      .refine((files) => files.every((file) => !hasUnsafeFileName(file.name)), "One or more file names are invalid.")
      .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE_BYTES), "File size must be 50MB or less."),
  })
  .superRefine((data, ctx) => {
    const phone = data.contactNumber?.trim() ?? "";
    if (phone && countryOptions.some((country) => country.code === data.country)) {
      const isValidContact = isValidPhoneNumber(phone, data.country as CountryCode);
      if (!isValidContact) {
        ctx.addIssue({
          code: "custom",
          path: ["contactNumber"],
          message: "Enter a valid contact number for the selected country.",
        });
      }
    }

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
      const hasWidth = Boolean(data.width?.trim());
      const hasHeight = Boolean(data.height?.trim());
      if (!hasWidth && !hasHeight) {
        ctx.addIssue({
          code: "custom",
          path: ["width"],
          message: "Either width or height is required.",
        });
        ctx.addIssue({
          code: "custom",
          path: ["height"],
          message: "Either width or height is required.",
        });
      }
      if (hasWidth && !/^\d+(\.\d+)?$/.test((data.width ?? "").trim())) {
        ctx.addIssue({
          code: "custom",
          path: ["width"],
          message: "Width must be a number.",
        });
      }
      if (hasHeight && !/^\d+(\.\d+)?$/.test((data.height ?? "").trim())) {
        ctx.addIssue({
          code: "custom",
          path: ["height"],
          message: "Height must be a number.",
        });
      }
      if (!data.numberOfColors?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["numberOfColors"],
          message: "Number of colors is required.",
        });
      }
      if (!data.appliqueRequired?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["appliqueRequired"],
          message: "Please select applique required.",
        });
      }
      if (data.numberOfColors?.trim()) {
        const normalizedNumberOfColors = data.numberOfColors.trim().toLowerCase();
        const isAccordingToLogo = normalizedNumberOfColors === "according to logo";
        const isNumeric = /^\d+$/.test(data.numberOfColors.trim());
        if (!isAccordingToLogo && !isNumeric) {
          ctx.addIssue({
            code: "custom",
            path: ["numberOfColors"],
            message: "Use a number or select 'According to Logo'.",
          });
        }
      }
      if (!data.colorwayToUse?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["colorwayToUse"],
          message: "Colorway is required.",
        });
      }
      if (data.colorwayToUse === "other" && !data.colorwayToUseOther?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["colorwayToUseOther"],
          message: "Please enter the colorway.",
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

export type QuoteFormState = z.infer<typeof quoteFormSchema>;

export const initialQuoteFormState: QuoteFormState = {
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
  colorwayToUseOther: "",
  additionalNotes: "",
  whatsappOptIn: false,
  files: [],
};
