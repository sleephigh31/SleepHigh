import { useParams, useRouterState } from "@tanstack/react-router";
import { DEFAULT_LOCALE, isLocale, translator } from "./i18n";
import type { Locale, Localized } from "./types";

/** Current locale from the URL, falling back to Arabic. */
export function useLocale(): Locale {
  const params = useParams({ strict: false }) as { locale?: string };
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (isLocale(params.locale)) return params.locale;
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function useT() {
  const locale = useLocale();
  return translator(locale);
}

export function useLocalized() {
  const locale = useLocale();
  return (value: Localized) => value[locale];
}

/** Build a locale-prefixed href, e.g. href("/cart") -> "/ar/cart" */
export function localeHref(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export function useHref() {
  const locale = useLocale();
  return (path: string) => localeHref(locale, path);
}

export function useDir(): "rtl" | "ltr" {
  const locale = useLocale();
  return locale === "ar" ? "rtl" : "ltr";
}

export function swapLocaleInPath(pathname: string, next: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length && isLocale(segments[0])) {
    segments[0] = next;
    return `/${segments.join("/")}`;
  }
  return `/${next}`;
}
