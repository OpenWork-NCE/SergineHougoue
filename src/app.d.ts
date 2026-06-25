import type { Locale } from "$i18n/locales";

declare module "$env/static/private" {
  export const SANITY_API_TOKEN: string;
  export const SANITY_READ_TOKEN: string;
  export const RESEND_API_KEY: string;
  export const CONTACT_TO_EMAIL: string;
  export const GA4_MEASUREMENT_ID: string;
  export const CAL_COM_LINK: string;
}

declare global {
  namespace App {
    interface Locals {
      locale: Locale;
    }
    interface PageData {
      locale: Locale;
    }
  }
}

export {};
