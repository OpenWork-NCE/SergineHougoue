<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";
  import {
    applyTheme,
    resolveInitialTheme,
    type Theme,
  } from "$utils/theme";
  import { onMount } from "svelte";

  interface Props {
    locale: Locale;
  }
  let { locale }: Props = $props();

  const copy = $derived(getCopy(locale));
  let theme = $state<Theme>("light");

  onMount(() => {
    theme = resolveInitialTheme();
    applyTheme(theme);
  });

  function toggle() {
    theme = theme === "light" ? "dark" : "light";
    applyTheme(theme);
  }

  const label = $derived(
    theme === "light" ? copy.theme.toDark : copy.theme.toLight,
  );
</script>

<button
  type="button"
  class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-secondary hover:text-primary hover:bg-[var(--state-hover)] transition-colors"
  aria-label={label}
  aria-pressed={theme === "dark"}
  onclick={toggle}
>
  {#if theme === "light"}
    <!-- moon icon (simple SVG) -->
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
    </svg>
  {:else}
    <!-- sun icon -->
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  {/if}
</button>
