import { getCopy } from "$i18n/copy";
import type { Locale } from "$i18n/locales";

function formatThousands(value: number, separator: string): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function formatPrice(price: number, locale: Locale): string {
  if (locale === "fr") {
    return `${formatThousands(price, " ")} $`;
  }

  return `$${formatThousands(price, ",")}`;
}

export function formatArea(area: number, locale: Locale): string {
  const { area: areaUnit } = getCopy(locale).property;
  const separator = locale === "fr" ? " " : ",";

  return `${formatThousands(area, separator)} ${areaUnit}`;
}

export function formatDate(date: string, locale: Locale): string {
  const localeTag = locale === "fr" ? "fr-CA" : "en-CA";

  return new Intl.DateTimeFormat(localeTag, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
