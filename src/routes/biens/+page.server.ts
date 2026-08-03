import { loadCmsListingsData } from "$sanity/load-cms";
import { fromCmsProperty } from "$lib/properties/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { locale } = await parent();
  const data = await loadCmsListingsData(locale);

  return {
    properties: (data.properties ?? []).map(fromCmsProperty),
  };
};
