import { z } from "zod";
import { countryOptions } from "./country-options";

const countryCodeSet = new Set(countryOptions.map((country) => country.code));

export const quoteContactSchema = z.object({
  country: z
    .string()
    .min(1, "Country is required.")
    .refine((value) => countryCodeSet.has(value as (typeof countryOptions)[number]["code"]), {
      message: "Select a valid country.",
    }),
  phone: z
    .string()
    .refine((value) => {
      const trimmed = value.trim();
      if (!trimmed) return true;
      return /^\+\d+$/.test(trimmed);
    }, {
      message: "Contact number must start with country code and digits only.",
    }),
});

export type QuoteContactValues = z.infer<typeof quoteContactSchema>;
