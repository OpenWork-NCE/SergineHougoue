import { loadCmsTransactionsData } from "$sanity/load-cms";
import { getStaticSoldProperties } from "$lib/properties/sold-static";
import { fromCmsProperty } from "$lib/properties/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { locale } = await parent();
  const cms = await loadCmsTransactionsData(locale);

  const cmsSold = (cms.soldProperties ?? []).map(fromCmsProperty);
  const staticSold = getStaticSoldProperties(locale);

  // Prefer CMS when same slug exists; otherwise show static portfolio
  const cmsSlugs = new Set(cmsSold.map((p) => p.slug.current));
  const merged = [
    ...cmsSold,
    ...staticSold.filter((p) => !cmsSlugs.has(p.slug.current)),
  ];

  return {
    soldProperties: merged,
  };
};
