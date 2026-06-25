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
  class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.08em]"
  role="group"
  aria-label="Language selector"
>
  <a
    href={frHref}
    class="text-secondary transition-colors hover:text-primary"
    aria-current={currentLocale === "fr" ? "true" : undefined}
    hreflang="fr"
  >FR</a>
  <span class="text-muted" aria-hidden="true">|</span>
  <a
    href={enHref}
    class="text-secondary transition-colors hover:text-primary"
    aria-current={currentLocale === "en" ? "true" : undefined}
    hreflang="en"
  >EN</a>
</div>