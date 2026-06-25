import { error } from "@sveltejs/kit";
import { loadCmsPosts } from "$sanity/load-cms";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, url }) => {
  const { locale } = await parent();
  const rawPage = Number(url.searchParams.get("page") ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const data = await loadCmsPosts(locale, page);

  if (data.totalPages > 0 && page > data.totalPages) {
    error(404, "Not found");
  }

  return data;
};