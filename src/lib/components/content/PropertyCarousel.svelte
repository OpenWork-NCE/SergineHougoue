<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import emblaCarouselSvelte from "embla-carousel-svelte";
  import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
  import type { Property } from "$sanity/types";
  import type { Locale } from "$i18n/locales";
  import { getCopy } from "$i18n/copy";
  import PropertyCard from "./PropertyCard.svelte";

  interface Props {
    properties: Property[];
    locale: Locale;
    basePath: string;
  }

  let { properties, locale, basePath }: Props = $props();

  const copy = $derived(getCopy(locale));
  const AUTO_ADVANCE_MS = 6000;

  const options: EmblaOptionsType = {
    align: "start",
    loop: true,
    containScroll: "trimSnaps",
  };

  let emblaApi = $state<EmblaCarouselType | undefined>();
  let reducedMotion = $state(true);
  let paused = $state(false);

  function onInit(event: CustomEvent<EmblaCarouselType>) {
    emblaApi = event.detail;
  }

  function scrollPrev() {
    emblaApi?.scrollPrev();
  }

  function scrollNext() {
    emblaApi?.scrollNext();
  }

  function pauseAutoAdvance() {
    paused = true;
  }

  function resumeAutoAdvance(event: FocusEvent) {
    const container = event.currentTarget as HTMLElement;
    const related = event.relatedTarget as Node | null;
    if (!related || !container.contains(related)) {
      paused = false;
    }
  }

  onMount(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      reducedMotion = mediaQuery.matches;
    };

    updateMotion();
    mediaQuery.addEventListener("change", updateMotion);

    return () => mediaQuery.removeEventListener("change", updateMotion);
  });

  $effect(() => {
    if (!browser || reducedMotion || paused || !emblaApi) return;

    const id = window.setInterval(() => {
      emblaApi?.scrollNext();
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(id);
  });
</script>

<div
  class="relative"
  onmouseenter={pauseAutoAdvance}
  onmouseleave={() => (paused = false)}
  onfocusin={pauseAutoAdvance}
  onfocusout={resumeAutoAdvance}
>
  <div class="mb-6 flex justify-end gap-3">
    <button
      type="button"
      class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-gold transition-colors hover:border-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
      aria-label={copy.home.carouselPrevious}
      onclick={scrollPrev}
    >
      <span aria-hidden="true">←</span>
    </button>
    <button
      type="button"
      class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-gold transition-colors hover:border-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
      aria-label={copy.home.carouselNext}
      onclick={scrollNext}
    >
      <span aria-hidden="true">→</span>
    </button>
  </div>

  {#snippet carouselSlides()}
    <div class="-ml-8 flex">
      {#each properties as property (property._id)}
        <div
          class="min-w-0 shrink-0 grow-0 basis-full pl-8 sm:basis-1/2 lg:basis-1/3"
        >
          <PropertyCard {property} {locale} {basePath} />
        </div>
      {/each}
    </div>
  {/snippet}

  {#if browser}
    <section
      aria-roledescription="carousel"
      aria-label={copy.home.carouselAriaLabel}
      class="overflow-hidden"
      use:emblaCarouselSvelte={{ options, plugins: [] }}
      onemblaInit={onInit}
    >
      {@render carouselSlides()}
    </section>
  {:else}
    <section
      aria-roledescription="carousel"
      aria-label={copy.home.carouselAriaLabel}
      class="overflow-hidden"
    >
      {@render carouselSlides()}
    </section>
  {/if}
</div>