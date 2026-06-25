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
  if (locale === "fr") {
    return `${formatThousands(area, " ")} pi²`;
  }

  return `${formatThousands(area, ",")} sq ft`;
}
