import { CAL_COM_LINK } from "$env/static/private";
import { loadCmsContactData } from "$sanity/load-cms";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const { siteSettings } = await loadCmsContactData();
  const calLink = (CAL_COM_LINK ?? "").trim() || null;

  return { siteSettings, calLink };
};