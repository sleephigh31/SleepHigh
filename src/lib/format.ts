import type { Locale, Localized } from "./types";

export function pick(value: Localized, locale: Locale) {
  return value[locale];
}

/** Egyptian pound formatting. Arabic uses Arabic-Indic digits + ج.م, English uses EGP. */
export function formatPrice(amount: number, locale: Locale) {
  if (locale === "ar") {
    const digits = new Intl.NumberFormat("ar-EG", {
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
    return `${digits} ج.م`;
  }
  const digits = new Intl.NumberFormat("en-EG", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${digits} EGP`;
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(value);
}

export function formatDate(iso: string, locale: Locale) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
