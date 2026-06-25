import { DEFAULT_LOCALE } from "$i18n/locales";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = () => ({
  locale: DEFAULT_LOCALE,
});
