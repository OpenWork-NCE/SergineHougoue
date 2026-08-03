<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";
  import {
    applyTheme,
    resolveInitialTheme,
    type Theme,
  } from "$utils/theme";
  import Moon from "lucide-svelte/icons/moon";
  import Sun from "lucide-svelte/icons/sun";
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
  class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-[var(--state-hover)] hover:text-primary"
  aria-label={label}
  aria-pressed={theme === "dark"}
  onclick={toggle}
>
  {#if theme === "light"}
    <Moon class="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
  {:else}
    <Sun class="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
  {/if}
</button>
