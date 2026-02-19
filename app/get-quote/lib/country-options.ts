import { getCountryCallingCode, getCountries, type CountryCode } from "libphonenumber-js";
import en from "react-phone-number-input/locale/en.json";

export type CountryOption = {
  code: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
  flagUrl: string;
};

const blockedCountryCodes = new Set<CountryCode>(["PK", "NP", "BD", "TA", "AC"]);

const toFlagEmoji = (countryCode: string): string =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const uniqueCountryByDialCode = getCountries()
  .filter((code) => !blockedCountryCodes.has(code as CountryCode))
  .map((code) => {
    const typedCode = code as CountryCode;
    const name = en[typedCode] ?? typedCode;
    const dialCode = `+${getCountryCallingCode(typedCode)}`;
    return {
      code: typedCode,
      name,
      dialCode,
      flag: toFlagEmoji(typedCode),
      flagUrl: `https://flagcdn.com/24x18/${typedCode.toLowerCase()}.png`,
    };
  })
  .reduce((acc, current) => {
    const existing = acc.get(current.dialCode);
    if (!existing) {
      acc.set(current.dialCode, current);
      return acc;
    }

    if (current.dialCode === "+1" && current.code === "US") {
      acc.set(current.dialCode, current);
      return acc;
    }

    if (existing.dialCode !== "+1" && current.name.localeCompare(existing.name) < 0) {
      acc.set(current.dialCode, current);
    }
    return acc;
  }, new Map<string, CountryOption>());

export const countryOptions: CountryOption[] = Array.from(uniqueCountryByDialCode.values()).sort((a, b) =>
  a.name.localeCompare(b.name)
);
