"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CountrySelect } from "./CountrySelect";
import { PhoneInputField } from "./PhoneInputField";
import { type QuoteContactValues, quoteContactSchema } from "../lib/quote-contact-schema";

type QuoteContactFieldsProps = {
  defaultCountry?: string;
  defaultPhone?: string;
  onValuesChangeAction?: (values: QuoteContactValues) => void;
};

export function QuoteContactFields({
  defaultCountry = "",
  defaultPhone = "",
  onValuesChangeAction,
}: QuoteContactFieldsProps) {
  const { control } = useForm<QuoteContactValues>({
    resolver: zodResolver(quoteContactSchema),
    mode: "onBlur",
    defaultValues: {
      country: defaultCountry,
      phone: defaultPhone,
    },
  });

  const country = useWatch({ control, name: "country" });
  const phone = useWatch({ control, name: "phone" });

  useEffect(() => {
    if (!onValuesChangeAction) return;
    onValuesChangeAction({
      country: country ?? "",
      phone: phone ?? "",
    });
  }, [country, onValuesChangeAction, phone]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <CountrySelect
        control={control}
        name="country"
        label="Country *"
      />

      <PhoneInputField
        control={control}
        name="phone"
        label="Contact Number"
        placeholder="Enter phone number"
      />
    </div>
  );
}
