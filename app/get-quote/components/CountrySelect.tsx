"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ControllerRenderProps, Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { countryOptions } from "../lib/country-options";

type CountrySelectProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  onCountryChangeAction?: (countryCode: string) => void;
};

type CountryFieldProps<TFieldValues extends FieldValues> = {
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
  errorMessage?: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  onCountryChangeAction?: (countryCode: string) => void;
};

function CountryField<TFieldValues extends FieldValues>({
  field,
  errorMessage,
  label,
  placeholder,
  disabled,
  onCountryChangeAction,
}: CountryFieldProps<TFieldValues>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedCountry = countryOptions.find((country) => country.code === field.value);
  const [query, setQuery] = useState(selectedCountry?.name ?? "");
  const [open, setOpen] = useState(false);
  const inputValue = open ? query : (selectedCountry?.name ?? query);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const filteredCountries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return countryOptions;
    return countryOptions.filter((country) => {
      return (
        country.name.toLowerCase().includes(normalized) ||
        country.code.toLowerCase().includes(normalized) ||
        country.dialCode.includes(normalized)
      );
    });
  }, [query]);

  const selectCountry = (countryCode: string) => {
    const match = countryOptions.find((country) => country.code === countryCode);
    if (!match) return;
    field.onChange(match.code);
    onCountryChangeAction?.(match.code);
    setQuery(match.name);
    setOpen(false);
  };

  const commitTypedCountry = () => {
    const exact = countryOptions.find((country) => country.name.toLowerCase() === query.trim().toLowerCase());
    if (exact) {
      field.onChange(exact.code);
      onCountryChangeAction?.(exact.code);
      setQuery(exact.name);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {selectedCountry ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <img
              src={selectedCountry.flagUrl}
              alt={`${selectedCountry.name} flag`}
              width="20"
              height="14"
              className="rounded-xs object-cover"
            />
          </span>
        ) : null}
        <input
          type="text"
          className={`input h-12 ${selectedCountry ? "pl-11" : ""}`}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => {
            setQuery(selectedCountry?.name ?? query);
            setOpen(true);
          }}
          onBlur={commitTypedCountry}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-120 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-64 overflow-y-auto py-1">
            {filteredCountries.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">No countries found.</li>}
            {filteredCountries.map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-100"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectCountry(country.code)}
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

      {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}

export function CountrySelect<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Country",
  placeholder = "Type country name",
  disabled,
  onCountryChangeAction,
}: CountrySelectProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <CountryField
          field={field}
          errorMessage={fieldState.error?.message}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          onCountryChangeAction={onCountryChangeAction}
        />
      )}
    />
  );
}
