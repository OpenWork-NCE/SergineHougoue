import { loadCmsTransactionsData } from "$sanity/load-cms";
import { fromCmsProperty } from "$lib/properties/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { locale } = await parent();
  const cms = await loadCmsTransactionsData(locale);

  return {
    soldProperties: (cms.soldProperties ?? []).map(fromCmsProperty),
  };
};
