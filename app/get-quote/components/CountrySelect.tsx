"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ControllerRenderProps, Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { countryOptions } from "../lib/country-options";
import Image from "next/image";

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

const findBestCountryMatch = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return undefined;

  const exactNameMatch = countryOptions.find((country) => country.name.toLowerCase() === normalized);
  if (exactNameMatch) return exactNameMatch;

  const exactCodeMatch = countryOptions.find((country) => country.code.toLowerCase() === normalized);
  if (exactCodeMatch) return exactCodeMatch;

  const exactInitialsMatch = countryOptions.find((country) => getCountryInitials(country.name) === normalized);
  if (exactInitialsMatch) return exactInitialsMatch;

  return countryOptions
    .filter((country) => matchesCountryQuery(country, normalized))
    .sort((a, b) => a.name.localeCompare(b.name))[0];
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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
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
    return countryOptions
      .filter((country) => matchesCountryQuery(country, normalized))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setHighlightedIndex(0);
  }, [open, query]);

  const selectCountry = (countryCode: string) => {
    const match = countryOptions.find((country) => country.code === countryCode);
    if (!match) return;
    field.onChange(match.code);
    onCountryChangeAction?.(match.code);
    setQuery(match.name);
    setOpen(false);
  };

  const commitTypedCountry = () => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      field.onChange("");
      onCountryChangeAction?.("");
      setQuery("");
      return;
    }

    const match = findBestCountryMatch(query);
    if (match) {
      field.onChange(match.code);
      onCountryChangeAction?.(match.code);
      setQuery(match.name);
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
          id={`${String(field.name)}-input`}
          name={String(field.name)}
          type="text"
          className={`input h-12 ${selectedCountry ? "pl-11" : ""}`}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => {
            setQuery(selectedCountry?.name ?? query);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setHighlightedIndex((prev) => {
                const maxIndex = filteredCountries.length - 1;
                if (maxIndex < 0) return 0;
                return Math.min(prev + 1, maxIndex);
              });
              return;
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setHighlightedIndex((prev) => Math.max(prev - 1, 0));
              return;
            }

            if (event.key === "Enter") {
              event.preventDefault();
              if (filteredCountries.length > 0) {
                const highlightedCountry = filteredCountries[highlightedIndex] ?? filteredCountries[0];
                if (highlightedCountry) {
                  selectCountry(highlightedCountry.code);
                  return;
                }
              }
              commitTypedCountry();
              return;
            }

            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          onBlur={commitTypedCountry}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setOpen(true);

            if (field.value) {
              const selectedName = selectedCountry?.name ?? "";
              if (nextQuery !== selectedName) {
                field.onChange("");
                onCountryChangeAction?.("");
              }
            }
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
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-100 ${
                    filteredCountries[highlightedIndex]?.code === country.code ? "bg-slate-100" : ""
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => {
                    const hoveredIndex = filteredCountries.findIndex((item) => item.code === country.code);
                    if (hoveredIndex >= 0) setHighlightedIndex(hoveredIndex);
                  }}
                  onClick={() => selectCountry(country.code)}
                >
                  <span className="inline-flex items-center gap-2">
                    <Image
                      src={country.flagUrl}
                      alt={`${country.name} flag`}
                      width="20"
                      height="14"
                      className="rounded-xs object-cover"
                    />
                    <span>{country.name}</span>
                  </span>
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
