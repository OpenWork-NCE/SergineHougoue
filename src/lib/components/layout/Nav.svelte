<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";
  import LangToggle from "./LangToggle.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

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
    { href: `${base}/equipe-partenaires`, label: copy.nav.teamPartners },
    { href: `${base}/a-propos`, label: copy.nav.about },
    { href: `${base}/contact`, label: copy.nav.contact },
  ]);
</script>

<nav
  class="sticky top-0 z-50 w-full border-b border-[color:var(--border-hairline)] bg-canvas/95 backdrop-blur-xl"
  aria-label="Primary"
>
  <div class="container-editorial flex h-16 md:h-20 items-center justify-between gap-4">
    <a
      href={`${base}/`}
      class="font-display text-2xl md:text-3xl lg:text-4xl tracking-tight text-primary flex items-center min-h-11"
      aria-label="Sergine Hougoue"
    >
      <span class="text-burgundy">S</span>ergine Hougoue
    </a>

    <div class="hidden md:flex items-center gap-2">
      <ul class="flex items-center gap-1 text-sm font-medium">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class="px-3 py-2 rounded-lg text-secondary hover:text-primary hover:bg-[var(--state-hover)] transition-all duration-200 {currentPath === link.href || currentPath === link.href.replace(/\/$/, '') ? 'text-primary bg-[var(--state-hover)]' : ''}"
              aria-current={currentPath === link.href ? "page" : undefined}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>

      <div class="ml-2 flex items-center gap-2">
        <ThemeToggle {locale} />
        <LangToggle {currentPath} currentLocale={locale} />
        <a href={`${base}/contact`} class="btn-primary text-sm px-5 py-2">
          {copy.nav.cta}
        </a>
      </div>
    </div>

    <div class="md:hidden flex items-center gap-2">
      <ThemeToggle {locale} />
      <a href={`${base}/contact`} class="btn-primary text-sm px-4 py-2">
        {copy.nav.cta}
      </a>
    </div>
  </div>
</nav>
