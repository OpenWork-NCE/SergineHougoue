import { error } from "@sveltejs/kit";
import { loadCmsPostBySlug } from "$sanity/load-cms";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
  const { locale } = await parent();
  const { slug } = await params;
  const post = await loadCmsPostBySlug(locale, slug);

  if (!post) {
    error(404, "Not found");
  }

  return { post };
};