<script lang="ts">
  import { browser } from "$app/environment";
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

  /** Primary nav only — secondary links live in the footer. */
  const links = $derived([
    { href: `${base}/biens`, label: copy.nav.listings },
    { href: `${base}/services`, label: copy.nav.services },
    { href: `${base}/a-propos`, label: copy.nav.about },
    { href: `${base}/contact`, label: copy.nav.contact },
  ]);

  let menuOpen = $state(false);
  let scrolled = $state(false);

  function pathActive(href: string): boolean {
    const path = currentPath.replace(/\/$/, "") || "/";
    const target = href.replace(/\/$/, "") || "/";
    if (target === base || target === `/${locale}`) {
      return path === target || path === `/${locale}` || path === `/${locale}/`;
    }
    return path === target || path.startsWith(`${target}/`);
  }

  function closeMenu() {
    menuOpen = false;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  $effect(() => {
    if (!browser) return;
    const onScroll = () => {
      scrolled = window.scrollY > 12;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  $effect(() => {
    if (!browser) return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  });

  $effect(() => {
    if (!browser || !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
</script>

<nav
  class="sticky top-0 z-50 w-full border-b transition-colors duration-300 {scrolled
    ? 'border-[color:var(--border-hairline)] bg-canvas/90 backdrop-blur-xl shadow-sm'
    : 'border-transparent bg-canvas/80 backdrop-blur-md'}"
  aria-label={copy.navChrome.primaryNav}
>
  <div
    class="container-editorial flex h-16 items-center justify-between gap-3 md:h-[4.5rem]"
  >
    <a
      href={`${base}/`}
      class="font-display text-xl tracking-tight text-primary flex items-center min-h-11 sm:text-2xl md:text-3xl"
      aria-label="Sergine Hougoue"
      onclick={closeMenu}
    >
      <span class="text-burgundy">S</span>ergine Hougoue
    </a>

    <!-- Desktop -->
    <div class="hidden lg:flex items-center gap-1">
      <ul class="flex items-center gap-0.5 text-sm font-medium">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class="px-3.5 py-2 rounded-lg text-secondary transition-colors duration-200 hover:text-primary hover:bg-[var(--state-hover)] {pathActive(
                link.href,
              )
                ? 'text-primary bg-[var(--state-hover)]'
                : ''}"
              aria-current={pathActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>

      <div class="ml-3 flex items-center gap-2 border-l border-[color:var(--border-hairline)] pl-3">
        <ThemeToggle {locale} />
        <LangToggle {currentPath} currentLocale={locale} />
        <a href={`${base}/contact`} class="btn-primary text-sm px-5 py-2.5">
          {copy.nav.cta}
        </a>
      </div>
    </div>

    <!-- Mobile / tablet -->
    <div class="flex lg:hidden items-center gap-1.5">
      <ThemeToggle {locale} />
      <a
        href={`${base}/contact`}
        class="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2"
      >
        {copy.nav.cta}
      </a>
      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-primary hover:bg-[var(--state-hover)] transition-colors"
        aria-label={menuOpen ? copy.navChrome.closeMenu : copy.navChrome.openMenu}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-drawer"
        onclick={toggleMenu}
      >
        {#if menuOpen}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        {:else}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        {/if}
      </button>
    </div>
  </div>
</nav>

{#if menuOpen}
  <!-- Backdrop -->
  <button
    type="button"
    class="fixed inset-0 z-[60] bg-black/40 lg:hidden"
    aria-label={copy.navChrome.closeMenu}
    onclick={closeMenu}
  ></button>

  <div
    id="mobile-nav-drawer"
    class="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,20rem)] flex-col border-l border-[color:var(--border-hairline)] bg-canvas shadow-xl lg:hidden"
    role="dialog"
    aria-modal="true"
    aria-label={copy.navChrome.primaryNav}
  >
    <div class="flex h-16 items-center justify-between border-b border-[color:var(--border-hairline)] px-5">
      <span class="font-display text-lg text-primary">
        <span class="text-burgundy">S</span>ergine
      </span>
      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-[var(--state-hover)]"
        aria-label={copy.navChrome.closeMenu}
        onclick={closeMenu}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <ul class="flex flex-1 flex-col gap-1 p-4 text-base font-medium">
      {#each links as link}
        <li>
          <a
            href={link.href}
            class="flex min-h-12 items-center rounded-xl px-4 text-primary transition-colors hover:bg-[var(--state-hover)] {pathActive(
              link.href,
            )
              ? 'bg-[var(--state-hover)]'
              : ''}"
            aria-current={pathActive(link.href) ? "page" : undefined}
            onclick={closeMenu}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>

    <div class="space-y-4 border-t border-[color:var(--border-hairline)] p-5">
      <LangToggle {currentPath} currentLocale={locale} />
      <a
        href={`${base}/contact`}
        class="btn-primary w-full text-sm"
        onclick={closeMenu}
      >
        {copy.nav.cta}
      </a>
      <ul class="space-y-2 pt-2 text-sm text-secondary">
        <li>
          <a href={`${base}/transactions`} class="hover:text-primary" onclick={closeMenu}
            >{copy.nav.transactions}</a
          >
        </li>
        <li>
          <a href={`${base}/blog`} class="hover:text-primary" onclick={closeMenu}
            >{copy.nav.blog}</a
          >
        </li>
        <li>
          <a
            href={`${base}/equipe-partenaires`}
            class="hover:text-primary"
            onclick={closeMenu}>{copy.nav.teamPartners}</a
          >
        </li>
      </ul>
    </div>
  </div>
{/if}
