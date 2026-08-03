<script lang="ts">
  import { browser } from "$app/environment";
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";
  import Menu from "lucide-svelte/icons/menu";
  import X from "lucide-svelte/icons/x";
  import LangToggle from "./LangToggle.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  interface Props {
    currentPath: string;
    locale: Locale;
  }
  let { currentPath, locale }: Props = $props();

  const copy = $derived(getCopy(locale));
  const base = $derived(`/${locale}`);

  /**
   * Primary nav: core journeys only.
   * Contact is the CTA (and footer). Équipe is drawer/footer secondary.
   */
  const links = $derived([
    { href: `${base}/biens`, label: copy.nav.listings },
    { href: `${base}/transactions`, label: copy.nav.transactions },
    { href: `${base}/services`, label: copy.nav.services },
    { href: `${base}/blog`, label: copy.nav.blog },
    { href: `${base}/a-propos`, label: copy.nav.about },
  ]);

  let menuOpen = $state(false);
  let scrolled = $state(false);
  let drawerEl = $state<HTMLDivElement | undefined>();
  let menuButtonEl = $state<HTMLButtonElement | undefined>();

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

  // Close drawer when the route changes (e.g. after link navigation)
  let lastPath = currentPath;
  $effect(() => {
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      menuOpen = false;
    }
  });

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

  // Escape + simple focus trap while drawer is open
  $effect(() => {
    if (!browser || !menuOpen) return;

    const drawer = drawerEl;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus into drawer
    queueMicrotask(() => {
      const first = drawer?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab" || !drawer) return;

      const focusable = [
        ...drawer.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // Restore focus to menu button when closing
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      } else {
        menuButtonEl?.focus();
      }
    };
  });
</script>

<header
  class="sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300 {scrolled
    ? 'border-b border-[color:var(--border-hairline)] bg-canvas/92 shadow-sm backdrop-blur-xl'
    : 'border-b border-transparent bg-canvas/80 backdrop-blur-md'}"
>
  <nav
    class="container-editorial flex h-16 items-center justify-between gap-3 md:h-[4.25rem]"
    aria-label={copy.navChrome.primaryNav}
  >
    <a
      href={`${base}/`}
      class="font-display flex min-h-11 shrink-0 items-center text-lg tracking-tight text-primary sm:text-xl md:text-2xl"
      aria-label="Sergine Hougoue"
      onclick={closeMenu}
    >
      <span class="text-burgundy">S</span>ergine Hougoue
    </a>

    <!-- Desktop / large tablet -->
    <div class="hidden min-w-0 items-center gap-1 lg:flex">
      <ul class="flex items-center gap-0.5">
        {#each links as link (link.href)}
          <li>
            <a
              href={link.href}
              class="relative inline-flex items-center rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-200 xl:px-3 xl:text-sm {pathActive(
                link.href,
              )
                ? 'text-primary'
                : 'text-secondary hover:bg-[var(--state-hover)] hover:text-primary'}"
              aria-current={pathActive(link.href) ? "page" : undefined}
            >
              {link.label}
              {#if pathActive(link.href)}
                <span
                  class="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-burgundy xl:inset-x-3"
                  aria-hidden="true"
                ></span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>

      <div
        class="ml-2 flex shrink-0 items-center gap-1.5 border-l border-[color:var(--border-hairline)] pl-2.5 xl:ml-3 xl:gap-2 xl:pl-3"
      >
        <ThemeToggle {locale} />
        <LangToggle {currentPath} currentLocale={locale} />
        <a
          href={`${base}/contact`}
          class="btn-primary ml-0.5 whitespace-nowrap px-4 py-2 text-xs xl:px-5 xl:py-2.5 xl:text-sm"
        >
          {copy.nav.cta}
        </a>
      </div>
    </div>

    <!-- Mobile / small tablet -->
    <div class="flex items-center gap-1 sm:gap-1.5 lg:hidden">
      <ThemeToggle {locale} />
      <a
        href={`${base}/contact`}
        class="btn-primary hidden whitespace-nowrap px-3 py-2 text-xs sm:inline-flex sm:text-sm"
      >
        {copy.nav.cta}
      </a>
      <button
        type="button"
        bind:this={menuButtonEl}
        class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-primary transition-colors hover:bg-[var(--state-hover)]"
        aria-label={menuOpen ? copy.navChrome.closeMenu : copy.navChrome.openMenu}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-drawer"
        onclick={toggleMenu}
      >
        {#if menuOpen}
          <X class="size-[22px]" strokeWidth={1.75} aria-hidden="true" />
        {:else}
          <Menu class="size-[22px]" strokeWidth={1.75} aria-hidden="true" />
        {/if}
      </button>
    </div>
  </nav>
</header>

{#if menuOpen}
  <button
    type="button"
    class="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px] lg:hidden"
    aria-label={copy.navChrome.closeMenu}
    onclick={closeMenu}
  ></button>

  <div
    id="mobile-nav-drawer"
    bind:this={drawerEl}
    class="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,20.5rem)] flex-col border-l border-[color:var(--border-hairline)] bg-canvas shadow-2xl lg:hidden"
    role="dialog"
    aria-modal="true"
    aria-label={copy.navChrome.primaryNav}
  >
    <div
      class="flex h-16 items-center justify-between border-b border-[color:var(--border-hairline)] px-4"
    >
      <a
        href={`${base}/`}
        class="font-display text-lg tracking-tight text-primary"
        aria-label="Sergine Hougoue"
        onclick={closeMenu}
      >
        <span class="text-burgundy">S</span>ergine
      </a>
      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-primary transition-colors hover:bg-[var(--state-hover)]"
        aria-label={copy.navChrome.closeMenu}
        onclick={closeMenu}
      >
        <X class="size-[22px]" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>

    <ul class="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3 text-base font-medium">
      {#each links as link (link.href)}
        <li>
          <a
            href={link.href}
            class="flex min-h-12 items-center rounded-xl px-4 transition-colors {pathActive(
              link.href,
            )
              ? 'bg-[var(--state-hover)] text-primary'
              : 'text-primary hover:bg-[var(--state-hover)]'}"
            aria-current={pathActive(link.href) ? "page" : undefined}
            onclick={closeMenu}
          >
            <span
              class="mr-3 h-1.5 w-1.5 shrink-0 rounded-full {pathActive(link.href)
                ? 'bg-burgundy'
                : 'bg-transparent'}"
              aria-hidden="true"
            ></span>
            {link.label}
          </a>
        </li>
      {/each}
      <li>
        <a
          href={`${base}/contact`}
          class="flex min-h-12 items-center rounded-xl px-4 text-primary transition-colors hover:bg-[var(--state-hover)] {pathActive(
            `${base}/contact`,
          )
            ? 'bg-[var(--state-hover)]'
            : ''}"
          aria-current={pathActive(`${base}/contact`) ? "page" : undefined}
          onclick={closeMenu}
        >
          <span
            class="mr-3 h-1.5 w-1.5 shrink-0 rounded-full {pathActive(
              `${base}/contact`,
            )
              ? 'bg-burgundy'
              : 'bg-transparent'}"
            aria-hidden="true"
          ></span>
          {copy.nav.contact}
        </a>
      </li>
    </ul>

    <div class="space-y-4 border-t border-[color:var(--border-hairline)] p-4">
      <div class="flex items-center justify-between gap-3">
        <LangToggle {currentPath} currentLocale={locale} />
        <ThemeToggle {locale} />
      </div>
      <a
        href={`${base}/contact`}
        class="btn-primary w-full text-sm"
        onclick={closeMenu}
      >
        {copy.nav.cta}
      </a>
      <a
        href={`${base}/equipe-partenaires`}
        class="block text-center text-sm text-secondary transition-colors hover:text-primary"
        onclick={closeMenu}
      >
        {copy.nav.teamPartners}
      </a>
    </div>
  </div>
{/if}
