import { error } from "@sveltejs/kit";
import { loadCmsPropertyBySlug } from "$sanity/load-cms";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { locale } = await parent();
  const { slug } = await params;
  const property = await loadCmsPropertyBySlug(locale, slug);

  if (!property) {
    error(404, "Not found");
  }

  return { property };
};
