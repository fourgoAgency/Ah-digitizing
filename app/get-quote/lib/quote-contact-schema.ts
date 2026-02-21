import { z } from "zod";
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import { countryOptions } from "./country-options";

const countryCodeSet = new Set(countryOptions.map((country) => country.code));

export const quoteContactSchema = z.object({
  country: z
    .string()
    .min(1, "Country is required.")
    .refine((value) => countryCodeSet.has(value as (typeof countryOptions)[number]["code"]), {
      message: "Select a valid country.",
    }),
  phone: z.string(),
}).superRefine((data, ctx) => {
  const phone = data.phone.trim();
  if (!phone) return;

  if (!countryCodeSet.has(data.country as (typeof countryOptions)[number]["code"])) {
    return;
  }

  const isValid = isValidPhoneNumber(phone, data.country as CountryCode);
  if (!isValid) {
    ctx.addIssue({
      code: "custom",
      path: ["phone"],
      message: "Enter a valid contact number for the selected country.",
    });
  }
});

export type QuoteContactValues = z.infer<typeof quoteContactSchema>;
