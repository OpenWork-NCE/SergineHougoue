import type { PageServerLoad } from "./$types";

// Private env - use process.env to avoid "not exported" build errors when vars not set
const CAL_COM_LINK = process.env.CAL_COM_LINK || "";

export const load: PageServerLoad = async ({ parent }) => {
  const { locale } = await parent();
  const calLink = (CAL_COM_LINK ?? "").trim() || null;

  return { locale, calLink };
};
