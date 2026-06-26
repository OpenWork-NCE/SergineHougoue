import { loadCmsContactData } from "$sanity/load-cms";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  const { siteSettings } = await loadCmsContactData();
  return { locale: locals.locale, siteSettings };
};
