<script lang="ts">
  import { onMount } from "svelte";
  import { getQuebecRegions, type QuebecRegion } from "$i18n/regions";
  import type { Locale } from "$i18n/locales";
  import { getCopy } from "$i18n/copy";

  interface Props {
    locale: Locale;
    /** Defaults to the 17 administrative regions of Quebec. */
    regions?: readonly QuebecRegion[];
  }

  let { locale, regions = getQuebecRegions() }: Props = $props();

  const copy = $derived(getCopy(locale));
  /** Two identical tracks for a seamless CSS loop. */
  const tracks = $derived([0, 1] as const);

  function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Read immediately when `window` exists so SSR hydrates correctly and tests see the right mode.
  let reducedMotion = $state(prefersReducedMotion());
  let paused = $state(false);

  onMount(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      reducedMotion = mediaQuery.matches;
    };

    updateMotion();
    mediaQuery.addEventListener("change", updateMotion);
    return () => mediaQuery.removeEventListener("change", updateMotion);
  });
</script>

<section
  class="regions-marquee relative border-b border-[color:var(--border-hairline)] bg-surface/40 py-6 md:py-7"
  aria-label={copy.blog.regionsAriaLabel}
  onmouseenter={() => (paused = true)}
  onmouseleave={() => (paused = false)}
  onfocusin={() => (paused = true)}
  onfocusout={(event) => {
    const container = event.currentTarget as HTMLElement;
    const related = event.relatedTarget as Node | null;
    if (!related || !container.contains(related)) {
      paused = false;
    }
  }}
>
  <!-- Soft edge fades -->
  <div
    class="regions-marquee__fade regions-marquee__fade--left pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16 md:w-24"
    aria-hidden="true"
  ></div>
  <div
    class="regions-marquee__fade regions-marquee__fade--right pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16 md:w-24"
    aria-hidden="true"
  ></div>

  {#if reducedMotion}
    <ul
      class="flex gap-2.5 overflow-x-auto px-5 sm:px-6 md:px-8 lg:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {#each regions as region (region)}
        <li class="regions-marquee__chip shrink-0">
          <span class="regions-marquee__dot" aria-hidden="true"></span>
          <span>{region}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="overflow-hidden">
      <div
        class="regions-marquee__track flex w-max gap-2.5"
        class:regions-marquee__track--paused={paused}
      >
        {#each tracks as track (track)}
          <ul
            class="flex shrink-0 gap-2.5 pr-2.5"
            aria-hidden={track === 1 ? "true" : undefined}
          >
            {#each regions as region (`${track}-${region}`)}
              <li class="regions-marquee__chip shrink-0">
                <span class="regions-marquee__dot" aria-hidden="true"></span>
                <span>{region}</span>
              </li>
            {/each}
          </ul>
        {/each}
      </div>
    </div>
  {/if}
</section>

<style>
  .regions-marquee__fade {
    background: linear-gradient(
      to right,
      var(--bg-canvas) 0%,
      color-mix(in srgb, var(--bg-canvas) 70%, transparent) 45%,
      transparent 100%
    );
  }

  .regions-marquee__fade--right {
    background: linear-gradient(
      to left,
      var(--bg-canvas) 0%,
      color-mix(in srgb, var(--bg-canvas) 70%, transparent) 45%,
      transparent 100%
    );
  }

  .regions-marquee__track {
    animation: regions-marquee-scroll 55s linear infinite;
    will-change: transform;
  }

  .regions-marquee__track--paused {
    animation-play-state: paused;
  }

  .regions-marquee__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    border-radius: 9999px;
    border: 1px solid var(--border-hairline);
    background: var(--bg-elevated);
    padding: 0.55rem 1rem 0.55rem 0.8rem;
    font-size: 0.8125rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: var(--text-primary);
    white-space: nowrap;
    box-shadow: 0 1px 0 color-mix(in srgb, var(--brand-gold) 18%, transparent);
    transition:
      border-color 200ms ease,
      box-shadow 200ms ease,
      transform 200ms ease;
  }

  .regions-marquee:hover .regions-marquee__chip {
    border-color: color-mix(in srgb, var(--brand-burgundy) 22%, var(--border-hairline));
  }

  .regions-marquee__dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    background: var(--brand-burgundy);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-burgundy) 14%, transparent);
    flex-shrink: 0;
  }

  @keyframes regions-marquee-scroll {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      /* Two identical tracks: shift by half the total width */
      transform: translate3d(-50%, 0, 0);
    }
  }
</style>
