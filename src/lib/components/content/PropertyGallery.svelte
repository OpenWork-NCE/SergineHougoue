<script lang="ts">
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import type { GalleryImage } from "$lib/properties/gallery";

  interface Props {
    images: GalleryImage[];
    statusLabel?: string;
    statusTone?: "sold" | "primeur" | "none";
    priceLabel?: string | null;
    galleryLabel: string;
    previousLabel: string;
    nextLabel: string;
    thumbnailsLabel: string;
  }

  let {
    images,
    statusLabel,
    statusTone = "none",
    priceLabel = null,
    galleryLabel,
    previousLabel,
    nextLabel,
    thumbnailsLabel,
  }: Props = $props();

  let activeIndex = $state(0);

  const active = $derived(images[activeIndex] ?? images[0]);
  const hasMultiple = $derived(images.length > 1);

  function goTo(index: number) {
    if (images.length === 0) return;
    activeIndex = ((index % images.length) + images.length) % images.length;
  }

  function previous() {
    goTo(activeIndex - 1);
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function onKeydown(event: KeyboardEvent) {
    if (!hasMultiple) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  }
</script>

{#if active}
  <section
    class="property-gallery"
    aria-label={galleryLabel}
    onkeydown={onKeydown}
  >
    <div
      class="relative overflow-hidden rounded-2xl border border-[color:var(--border-hairline)] bg-surface"
    >
      <!-- Fixed aspect frame so global img height:auto cannot collapse the hero -->
      <div class="relative aspect-[16/10] w-full sm:aspect-[16/9]">
        <img
          src={active.src}
          alt={active.alt}
          class="absolute inset-0 size-full object-cover"
          width="1600"
          height="900"
          fetchpriority="high"
        />

        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10"
          aria-hidden="true"
        ></div>

        {#if statusLabel && statusTone !== "none"}
          <span
            class="absolute left-4 top-4 rounded-lg px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider sm:left-5 sm:top-5 {statusTone ===
            'sold'
              ? 'bg-burgundy text-on-brand'
              : 'bg-gold text-canvas'}"
          >
            {statusLabel}
          </span>
        {/if}

        {#if priceLabel}
          <div
            class="absolute bottom-4 left-4 rounded-xl bg-canvas/95 px-4 py-2 font-display text-xl tracking-tight text-gold-text shadow-sm backdrop-blur-sm sm:bottom-5 sm:left-5 sm:text-2xl"
          >
            {priceLabel}
          </div>
        {/if}

        {#if hasMultiple}
          <div
            class="absolute bottom-4 right-4 rounded-full bg-canvas/90 px-3 py-1 text-xs font-medium text-secondary backdrop-blur-sm sm:bottom-5 sm:right-5"
          >
            {activeIndex + 1} / {images.length}
          </div>

          <div class="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
            <button
              type="button"
              class="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              aria-label={previousLabel}
              onclick={previous}
            >
              <ChevronLeft class="size-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
            <button
              type="button"
              class="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              aria-label={nextLabel}
              onclick={next}
            >
              <ChevronRight class="size-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        {/if}
      </div>
    </div>

    {#if hasMultiple}
      <ul
        class="mt-3 flex gap-2 overflow-x-auto pb-1"
        aria-label={thumbnailsLabel}
      >
        {#each images as image, index (image.src + index)}
          <li class="shrink-0">
            <button
              type="button"
              class="relative block h-16 w-24 overflow-hidden rounded-lg border transition-all sm:h-[4.5rem] sm:w-28 {activeIndex ===
              index
                ? 'border-burgundy ring-2 ring-burgundy/30'
                : 'border-[color:var(--border-hairline)] opacity-80 hover:opacity-100'}"
              aria-label={`${index + 1} / ${images.length}`}
              aria-current={activeIndex === index ? "true" : undefined}
              onclick={() => goTo(index)}
            >
              <img
                src={image.src}
                alt=""
                class="absolute inset-0 size-full object-cover"
                width="160"
                height="100"
                loading="lazy"
              />
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
{/if}
