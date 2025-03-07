import _enUS from "./locales/en-US.json";
const enUS: Record<string, string> = _enUS;

export const locales = ["en-US"];

const localeRecords: Record<string, Record<string, string>> = {
    "en-US": enUS
}

export function getCurrentLocale() {
    return "en-US";
}

export function t(key: string): string  {
    return tCustomLocale(key, getCurrentLocale())
}

export function tCustomLocale(key: string, locale: string): string {
    if (localeRecords[locale] && localeRecords[locale][key]) {
        return localeRecords[locale][key];
    }
    return `${locale}:${key}`;
}