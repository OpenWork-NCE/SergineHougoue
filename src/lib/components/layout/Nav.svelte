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
  class="sticky top-0 z-50 w-full border-b border-white/10 bg-canvas/95 backdrop-blur-xl"
  aria-label="Primary"
>
  <div class="container-editorial flex h-16 md:h-20 items-center justify-between gap-4">
    <!-- Logo -->
    <a href={`${base}/`} class="font-display text-xl tracking-tight text-primary flex items-center">
      <span class="text-burgundy">S</span>ergine Hougoue
    </a>

    <!-- Desktop Navigation (Allys-inspired clean structure) -->
    <div class="hidden md:flex items-center gap-2">
      <ul class="flex items-center gap-1 text-sm font-medium">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class="px-4 py-2 rounded-lg text-secondary hover:text-primary hover:bg-white/5 transition-all duration-200 {currentPath === link.href ? 'text-primary bg-white/5' : ''}"
              aria-current={currentPath === link.href ? "page" : undefined}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>

      <div class="ml-2 flex items-center gap-3">
        <LangToggle currentPath={currentPath} currentLocale={locale} />

        <a
          href={`${base}/contact`}
          class="btn-primary text-sm px-5 py-2"
        >
          {copy.nav.cta}
        </a>
      </div>
    </div>

    <!-- Mobile CTA -->
    <div class="md:hidden">
      <a href={`${base}/contact`} class="btn-primary text-sm px-4 py-2">
        {copy.nav.cta}
      </a>
    </div>
  </div>
</nav>