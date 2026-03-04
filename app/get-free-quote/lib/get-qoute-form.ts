import { z } from "zod";
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import { countryOptions } from "../../get-quote/lib/country-options";
import {
  isAllowedUploadFile,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_COUNT,
} from "../../get-quote/lib/quote-form";

const hasUnsafeFileName = (fileName: string) => /(\.\.)|[<>:"/\\|?*\x00-\x1F]/.test(fileName);

export const getQouteFormSchema = z
  .object({
    fullName: z.string().trim().min(1, "Name is required."),
    companyName: z.string().trim().optional(),
    contactNumber: z.string().trim().optional(),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    country: z.string().trim().min(1, "Select your country."),
    orderType: z.enum(["embroidery", "vector"], {
      errorMap: () => ({ message: "Order type is required." }),
    }),
    designName: z.string().trim().min(1, "Design name is required."),
    numberOfColors: z.string().trim().min(1, "Number of colors is required."),
    unitType: z.enum(["inches", "centimeter", "millimeter"], {
      errorMap: () => ({ message: "Unit type is required." }),
    }),
    width: z.string().optional(),
    height: z.string().optional(),
    additionalNotes: z.string().optional(),
    whatsappOptIn: z.boolean(),
    files: z
      .array(z.instanceof(File))
      .min(1, "Please upload one file.")
      .max(MAX_FILES_COUNT, `You can upload up to ${MAX_FILES_COUNT} files.`)
      .refine(
        (files) => files.every((file) => isAllowedUploadFile(file)),
        "Only images and document/design files are allowed. Videos are blocked."
      )
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

    if (!data.whatsappOptIn) {
      ctx.addIssue({
        code: "custom",
        path: ["whatsappOptIn"],
        message: "Please enable WhatsApp to continue.",
      });
    }
  });

export type GetQouteFormState = z.infer<typeof getQouteFormSchema>;

export const initialGetQouteFormState: GetQouteFormState = {
  fullName: "",
  companyName: "",
  contactNumber: "",
  email: "",
  country: "",
  orderType: "embroidery",
  designName: "",
  numberOfColors: "",
  unitType: "",
  width: "",
  height: "",
  additionalNotes: "",
  whatsappOptIn: false,
  files: [],
};
