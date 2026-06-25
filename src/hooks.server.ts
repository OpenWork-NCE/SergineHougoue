import { redirect, type Handle } from "@sveltejs/kit";
import { DEFAULT_LOCALE, isLocale } from "$i18n/locales";
import { detectLocale } from "$i18n/detectLocale";

export const handle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;
  const acceptLanguage = event.request.headers.get("accept-language");

  // Skip Studio and static assets
  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/_app") ||
    pathname.startsWith("/api")
  ) {
    if (pathname.startsWith("/studio")) {
      event.locals.locale = DEFAULT_LOCALE;
    }
    return resolve(event);
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (!first || !isLocale(first)) {
    const locale = detectLocale(pathname, acceptLanguage);
    const target = `/${locale}${pathname === "/" ? "/" : pathname}`;
    throw redirect(307, target);
  }

  event.locals.locale = detectLocale(pathname);
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%sveltekit.lang%", event.locals.locale),
  });
};
