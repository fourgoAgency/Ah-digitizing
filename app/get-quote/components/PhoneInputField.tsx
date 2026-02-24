"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { countryOptions } from "../lib/country-options";

type PhoneInputFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

const getDialCodeByCountry = (countryCode?: string): string => {
  if (!countryCode) return "";
  return countryOptions.find((country) => country.code === countryCode)?.dialCode ?? "";
};

const findCountryByPhoneValue = (value: string): string | undefined => {
  if (!value.startsWith("+")) return undefined;
  if (value.startsWith("+1")) return "US";
  const sortedByDialLength = [...countryOptions].sort((a, b) => b.dialCode.length - a.dialCode.length);
  return sortedByDialLength.find((country) => value.startsWith(country.dialCode))?.code;
};

type CodeSelectorProps = {
  selectedCountryCode?: string;
  disabled?: boolean;
  onSelectAction: (countryCode: string) => void;
};

const getCountryInitials = (name: string): string =>
  name
    .split(/[\s()-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toLowerCase();

const matchesCountryQuery = (country: { name: string; code: string }, normalizedQuery: string): boolean => {
  if (!normalizedQuery) return true;
  const name = country.name.toLowerCase();
  const code = country.code.toLowerCase();
  const initials = getCountryInitials(country.name);
  return name.startsWith(normalizedQuery) || code.startsWith(normalizedQuery) || initials.startsWith(normalizedQuery);
};

function CodeSelector({ selectedCountryCode, disabled, onSelectAction }: CodeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedCountry = countryOptions.find((country) => country.code === selectedCountryCode);

  const filteredCountries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return countryOptions;
    return countryOptions
      .filter((country) => matchesCountryQuery(country, normalized))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query]);

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
        className="input h-12 min-w-28 rounded-r-none border-r-0 pr-2"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="inline-flex w-full items-center justify-between gap-2">
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
            <span>{selectedCountry?.dialCode ?? "Code"}</span>
          </span>
          <ChevronDown size={16} className="shrink-0 text-gray-600" />
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
            {filteredCountries.map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-100"
                  onClick={() => {
                    onSelectAction(country.code);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <img
                      src={country.flagUrl}
                      alt={`${country.name} flag`}
                      width="20"
                      height="14"
                      className="rounded-xs object-cover"
                    />
                    <span>{country.name}</span>
                  </span>
                  <span className="text-gray-500">{country.dialCode}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PhoneInputField<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Phone",
  placeholder = "Enter phone number",
  disabled,
}: PhoneInputFieldProps<TFieldValues>) {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | undefined>(
    countryOptions.find((country) => country.code === "US")?.code ?? countryOptions[0]?.code
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const rawValue = (field.value as string | undefined) ?? "";
        const inferredCountryCode = findCountryByPhoneValue(rawValue);
        const effectiveCountryCode = inferredCountryCode ?? selectedCountryCode;
        const currentDialCode = getDialCodeByCountry(effectiveCountryCode);
        const localDigits = currentDialCode && rawValue.startsWith(currentDialCode)
          ? rawValue.slice(currentDialCode.length).replace(/\D/g, "")
          : rawValue.replace(/\D/g, "");

        return (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-stretch">
              <CodeSelector
                selectedCountryCode={effectiveCountryCode}
                disabled={disabled}
                onSelectAction={(nextCountryCode) => {
                  setSelectedCountryCode(nextCountryCode);
                  const nextDialCode = getDialCodeByCountry(nextCountryCode);
                  field.onChange(localDigits ? `${nextDialCode}${localDigits}` : "");
                }}
              />
              <input
                id={String(field.name)}
                name={String(field.name)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="input h-12 flex-1 rounded-l-none"
                placeholder={placeholder}
                disabled={disabled}
                value={localDigits}
                onChange={(event) => {
                  const digitsOnly = event.target.value.replace(/\D/g, "");
                  if (!digitsOnly) {
                    field.onChange("");
                    return;
                  }
                  field.onChange(`${currentDialCode}${digitsOnly}`);
                }}
                onBlur={field.onBlur}
              />
            </div>
            {fieldState.error?.message && <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>}
          </div>
        );
      }}
    />
  );
}


