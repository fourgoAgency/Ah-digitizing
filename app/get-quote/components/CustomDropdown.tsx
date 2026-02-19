"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type CustomDropdownProps = {
  placeholder: string;
  options: string[];
  value: string;
  id?: string;
  disabled?: boolean;
  onSelectAction: (value: string) => void;
};

export function CustomDropdown({
  placeholder,
  options,
  value,
  id,
  disabled,
  onSelectAction,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const canType = !disabled;
  const inputValue = query !== "" ? query : value;
  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.toLowerCase().includes(normalized));
  }, [options, query]);

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
      <div className="flex">
        <input
          id={id}
          type="text"
          className="input h-12 rounded-r-none border-r-0"
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          readOnly={!canType}
          onChange={(event) => {
            if (!canType) return;
            if (value) onSelectAction("");
            setQuery(event.target.value);
          }}
        />
        <button
          type="button"
          disabled={disabled}
          aria-label="Toggle options"
          className="inline-flex h-12 w-10 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          onClick={() => setOpen((prev) => !prev)}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {open && !disabled && (
        <ul className="absolute left-0 top-full z-120 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {filteredOptions.map((option) => (
            <li key={option}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-slate-100"
                onClick={() => {
                  onSelectAction(option);
                  setQuery("");
                  setOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
          {filteredOptions.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">No options found.</li>}
        </ul>
      )}
    </div>
  );
}
