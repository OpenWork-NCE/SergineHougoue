import { loadCmsAboutData } from "$sanity/load-cms";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { locale } = await parent();
  return loadCmsAboutData(locale);
};
