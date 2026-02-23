"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type CustomDropdownProps = {
  placeholder: string;
  options: string[];
  value: string;
  id?: string;
  disabled?: boolean;
  allowTyping?: boolean;
  onSelectAction: (value: string) => void;
};

export function CustomDropdown({
  placeholder,
  options,
  value,
  id,
  disabled,
  allowTyping = true,
  onSelectAction,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const canType = !disabled && allowTyping;
  const inputValue = query !== "" ? query : value;
  const commitTypedValue = () => {
    if (!canType) return;
    const typed = query.trim();
    if (!typed) return;
    onSelectAction(typed);
    setQuery(typed);
    setOpen(false);
  };
  const filteredOptions = useMemo(() => options, [options]);

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
      <input
        id={id}
        type="text"
        className={`input h-12 pr-12 ${canType ? "" : "cursor-pointer"}`}
        placeholder={placeholder}
        value={inputValue}
        disabled={disabled}
        readOnly={!canType}
        onFocus={() => {
          if (!canType) {
            setOpen(true);
            return;
          }
          setOpen(false);
        }}
        onClick={() => {
          if (!canType && !disabled) {
            setOpen((prev) => !prev);
          }
        }}
        onChange={(event) => {
          if (!canType) return;
          if (value) onSelectAction("");
          setQuery(event.target.value);
          setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          commitTypedValue();
        }}
        onBlur={commitTypedValue}
      />
      <button
        type="button"
        disabled={disabled}
        aria-label="Toggle options"
        className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center rounded-r-md border-l border-gray-300 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen((prev) => !prev)}
      >
        <ChevronDown size={16} />
      </button>

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
