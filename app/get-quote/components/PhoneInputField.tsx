"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import type { Control, FieldPath, FieldValues, UseFormSetValue } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import PhoneInput, { type Country, type Value } from "react-phone-number-input";
import { countryOptions } from "../lib/country-options";

type PhoneCountryOption = {
  value?: Country;
  label: string;
};

type PhoneCountrySelectProps = {
  value?: Country;
  options: PhoneCountryOption[];
  onChange: (value?: Country) => void;
  disabled?: boolean;
};

type PhoneInputFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  setValueAction: UseFormSetValue<TFieldValues>;
  name: FieldPath<TFieldValues>;
  countryName: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

function SearchablePhoneCountrySelect({
  value,
  options,
  onChange,
  disabled,
}: PhoneCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  const selectedDialCode = value ? `+${getCountryCallingCode(value as CountryCode)}` : "";
  const selectedCountry = countryOptions.find((country) => country.code === value);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        className="input h-12 min-w-24 rounded-r-none border-r-0"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="inline-flex items-center gap-2">
          {selectedCountry ? (
            <img
              src={selectedCountry.flagUrl}
              alt={`${selectedCountry.name} flag`}
              width="20"
              height="14"
              className="rounded-xs object-cover"
            />
          ) : null}
          <span>{selectedDialCode || "Code"}</span>
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-120 mt-1 w-[320px] rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-2">
            <input
              type="text"
              className="input h-10"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country..."
            />
          </div>

          <ul className="max-h-64 overflow-y-auto py-1">
            {filteredOptions.map((option) => {
              const optionDialCode = option.value ? `+${getCountryCallingCode(option.value as CountryCode)}` : "";
              return (
                <li key={option.value ?? "international"}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      {option.value ? (
                        <img
                          src={`https://flagcdn.com/24x18/${option.value.toLowerCase()}.png`}
                          alt={`${option.label} flag`}
                          width="20"
                          height="14"
                          className="rounded-xs object-cover"
                        />
                      ) : null}
                      <span>{option.label}</span>
                    </span>
                    <span className="text-gray-500">{optionDialCode}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PhoneInputField<TFieldValues extends FieldValues>({
  control,
  setValueAction,
  name,
  countryName,
  label = "Phone",
  placeholder = "Enter phone number",
  disabled,
}: PhoneInputFieldProps<TFieldValues>) {
  const watchedCountry = useWatch({ control, name: countryName }) as string | undefined;
  const selectedCountry = watchedCountry ? (watchedCountry as Country) : undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
          <PhoneInput
            international
            withCountryCallingCode
            country={selectedCountry}
            countrySelectComponent={SearchablePhoneCountrySelect}
            value={(field.value as Value | undefined) || undefined}
            onChange={(nextValue) => {
              field.onChange(nextValue ?? "");
              if (!nextValue) return;

              const parsed = parsePhoneNumberFromString(nextValue);
              if (parsed?.country) {
                setValueAction(countryName, parsed.country as never, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }
            }}
            onCountryChange={(nextCountry) => {
              if (!nextCountry) return;
              setValueAction(countryName, nextCountry as never, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
            }}
            className="flex items-stretch"
            numberInputProps={{
              className: "input h-12 rounded-l-none flex-1",
              placeholder,
              disabled,
            }}
            disabled={disabled}
            onBlur={field.onBlur}
          />
          {fieldState.error?.message && <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}
