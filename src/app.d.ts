import type { Locale } from "$i18n/locales";

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
