<script lang="ts">
  import type { Locale } from "$i18n/locales";
  import { translatePath } from "$i18n/detectLocale";

  interface Props {
    currentPath: string;
    currentLocale: Locale;
  }
  let { currentPath, currentLocale }: Props = $props();

  const frHref = $derived(translatePath(currentPath, currentLocale, "fr"));
  const enHref = $derived(translatePath(currentPath, currentLocale, "en"));
</script>

<div
  class="inline-flex items-center rounded-full border border-[color:var(--border-hairline)] p-0.5 text-[11px] uppercase tracking-[0.08em]"
  role="group"
  aria-label="Language selector"
>
  <a
    href={frHref}
    class="rounded-full px-2.5 py-1.5 transition-colors {currentLocale === 'fr'
      ? 'bg-[var(--state-hover)] font-medium text-primary'
      : 'text-secondary hover:text-primary'}"
    aria-current={currentLocale === "fr" ? "true" : undefined}
    hreflang="fr"
  >FR</a>
  <a
    href={enHref}
    class="rounded-full px-2.5 py-1.5 transition-colors {currentLocale === 'en'
      ? 'bg-[var(--state-hover)] font-medium text-primary'
      : 'text-secondary hover:text-primary'}"
    aria-current={currentLocale === "en" ? "true" : undefined}
    hreflang="en"
  >EN</a>
</div>