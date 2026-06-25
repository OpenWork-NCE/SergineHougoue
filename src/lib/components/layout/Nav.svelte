<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";
  import LangToggle from "./LangToggle.svelte";

  interface Props {
    currentPath: string;
    locale: Locale;
  }
  let { currentPath, locale }: Props = $props();

  const copy = $derived(getCopy(locale));
  const base = $derived(`/${locale}`);

  const links = $derived([
    { href: `${base}/`, label: copy.nav.home },
    { href: `${base}/services`, label: copy.nav.services },
    { href: `${base}/biens`, label: copy.nav.listings },
    { href: `${base}/transactions`, label: copy.nav.transactions },
    { href: `${base}/blog`, label: copy.nav.blog },
    { href: `${base}/a-propos`, label: copy.nav.about },
    { href: `${base}/contact`, label: copy.nav.contact },
  ]);
</script>

<nav
  class="sticky top-0 z-50 w-full border-b border-[var(--border-hairline)] bg-canvas/80 backdrop-blur-md"
  aria-label="Primary"
>
  <div class="container-editorial flex h-16 items-center justify-between gap-6">
    <a href={`${base}/`} class="font-display text-lg tracking-tight text-primary">
      <span class="text-gold">S</span>ergine Hougoue
    </a>

    <div class="hidden items-center gap-6 md:flex">
      <ul class="flex items-center gap-8">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class="text-sm text-secondary transition-colors duration-300 hover:text-primary"
              aria-current={currentPath === link.href ? "page" : undefined}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>

      <LangToggle currentPath={currentPath} currentLocale={locale} />

      <a
        href={`${base}/contact`}
        class="rounded-full border border-burgundy bg-burgundy px-4 py-2 text-xs uppercase tracking-[0.08em] text-primary transition-colors hover:bg-[#8a2638]"
      >
        {copy.nav.cta}
      </a>
    </div>
  </div>
</nav>