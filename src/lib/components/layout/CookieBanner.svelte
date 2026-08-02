<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import type { Locale } from "$i18n/locales";

  const CONSENT_KEY = "sergine_cookie_consent";

  interface Props {
    locale: Locale;
  }
  let { locale }: Props = $props();

  const copy = $derived(getCopy(locale));

  function shouldShowBanner(): boolean {
    if (typeof localStorage === "undefined") return true;
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored !== "accepted" && stored !== "rejected";
  }

  let visible = $state(shouldShowBanner());

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    visible = false;
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    visible = false;
  }
</script>

{#if visible}
  <div
    role="region"
    aria-label={copy.cookie.title}
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-hairline)] bg-[var(--bg-elevated)] shadow-lg"
  >
    <div
      class="container-editorial flex flex-col items-start gap-4 py-4 md:flex-row md:items-center md:justify-between md:gap-8 md:py-5"
    >
      <div class="max-w-2xl">
        <p class="text-sm font-medium text-primary">{copy.cookie.title}</p>
        <p class="mt-1 text-sm leading-relaxed text-secondary">
          {copy.cookie.body}
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onclick={reject}
          class="rounded-full border border-[var(--border-hairline)] px-4 py-2 text-xs uppercase tracking-[0.08em] text-secondary transition-colors hover:border-primary hover:text-primary"
        >
          {copy.cookie.reject}
        </button>
        <button
          type="button"
          onclick={accept}
          class="rounded-full border border-burgundy bg-burgundy px-4 py-2 text-xs uppercase tracking-[0.08em] text-on-brand transition-colors hover:bg-[#8a2638]"
        >
          {copy.cookie.accept}
        </button>
      </div>
    </div>
  </div>
{/if}