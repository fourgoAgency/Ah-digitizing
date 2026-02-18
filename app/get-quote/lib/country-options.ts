import { getCountryCallingCode, getCountries, type CountryCode } from "libphonenumber-js";
import en from "react-phone-number-input/locale/en.json";

export type CountryOption = {
  code: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
  flagUrl: string;
};

const toFlagEmoji = (countryCode: string): string =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

export const countryOptions: CountryOption[] = getCountries()
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
  .sort((a, b) => a.name.localeCompare(b.name));
