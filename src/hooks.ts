import { isLocale } from "$i18n/locales";
import type { Reroute } from "@sveltejs/kit";

/** Strip locale prefix for route matching; public URLs stay prefixed (/fr/...). */
export const reroute: Reroute = ({ url }) => {
  const segments = url.pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) {
    const rest = segments.slice(1);
    return rest.length ? `/${rest.join("/")}` : "/";
  }
};
