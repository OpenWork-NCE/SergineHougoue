import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

export function detectLocale(
  pathname: string,
  acceptLanguage?: string | null,
): Locale {
  const path = pathname.split("?")[0]?.split("#")[0] ?? "/";
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) return first;

  if (segments.length > 0 && acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")
      .map((part) => part.trim().split(";")[0]?.toLowerCase() ?? "")
      .map((tag) => tag.split("-")[0] ?? "")
      .find((tag) => isLocale(tag));
    if (preferred) return preferred as Locale;
  }

  return DEFAULT_LOCALE;
}

export function translatePath(
  pathname: string,
  from: Locale,
  to: Locale,
): string {
  if (from === to) return pathname;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = path.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) {
    segments[0] = to;
  } else {
    segments.unshift(to);
  }
  if (segments.length === 1) return `/${to}/`;
  return `/${segments.join("/")}`;
}
