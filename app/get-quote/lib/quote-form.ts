import { z } from "zod";

export const outputFormats = ["DST", "PES", "JEF", "EXP", "NGS", "PXF", "CND", "ART", "VP3"] as const;
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

export const quoteFormSchema = z
  .object({
    fullName: z.string().trim().min(1, "Name is required."),
    companyName: z.string().trim().optional(),
    contactNumber: z.string().trim().optional(),
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
    appliqueRequired: z.enum(["default", "yes", "no"]).default("default"),
    colorsName: z.string().optional(),
    numberOfColors: z.string().optional(),
    colorwayToUse: z.string().optional(),
    colorwayToUseOther: z.string().optional(),
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
      if (!data.numberOfColors?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["numberOfColors"],
          message: "Number of colors is required.",
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
  appliqueRequired: "default",
  colorsName: "",
  numberOfColors: "",
  colorwayToUse: "",
  colorwayToUseOther: "",
  additionalNotes: "",
  whatsappOptIn: false,
  files: [],
};
