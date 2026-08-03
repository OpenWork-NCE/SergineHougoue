import { error } from "@sveltejs/kit";
import { loadCmsPropertyBySlug } from "$sanity/load-cms";
import { getStaticSoldPropertyBySlug } from "$lib/properties/sold-static";
import { fromCmsProperty } from "$lib/properties/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { locale } = await parent();
  const { slug } = await params;

  const cms = await loadCmsPropertyBySlug(locale, slug);
  if (cms) {
    return { property: fromCmsProperty(cms) };
  }

  const staticSold = getStaticSoldPropertyBySlug(locale, slug);
  if (staticSold) {
    return { property: staticSold };
  }

  error(404, "Not found");
};
