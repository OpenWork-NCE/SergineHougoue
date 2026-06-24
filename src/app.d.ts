// Placeholder until Task 1.4 introduces $i18n/locales
type Locale = 'fr' | 'en';

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
