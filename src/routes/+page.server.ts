import { loadCmsHomeData } from "$sanity/load-cms";
import { fromCmsProperty } from "$lib/properties/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { locale } = await parent();
  const data = await loadCmsHomeData(locale);

  return {
    ...data,
    featuredProperties: (data.featuredProperties ?? []).map(fromCmsProperty),
  };
};
