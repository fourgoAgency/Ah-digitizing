"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js";
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
  const { control, getValues, setValue } = useForm<QuoteContactValues>({
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
        label="Country"
        onCountryChangeAction={(countryCode) => {
          const currentPhone = getValues("phone") ?? "";
          if (currentPhone.trim()) return;
          const dialCode = `+${getCountryCallingCode(countryCode as CountryCode)}`;
          setValue("phone", dialCode, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: false,
          });
        }}
      />

      <PhoneInputField
        control={control}
        setValueAction={setValue}
        name="phone"
        countryName="country"
        label="Contact Number"
        placeholder="Enter phone number"
      />
    </div>
  );
}
