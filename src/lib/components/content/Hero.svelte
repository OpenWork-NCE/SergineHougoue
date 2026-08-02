<script lang="ts">
  interface Props {
    eyebrow: string;
    title: string;
    subtitle?: string;
    ctaHref: string;
    ctaLabel: string;
    secondaryCtaHref?: string;
    secondaryCtaLabel?: string;
    scrollCue?: string;
    imageSrc?: string;
    imageAlt?: string;
    /** full = cinematic home hero; split = legacy compact (unused) */
    variant?: "full" | "split";
  }

  let {
    eyebrow,
    title,
    subtitle,
    ctaHref,
    ctaLabel,
    secondaryCtaHref,
    secondaryCtaLabel,
    scrollCue,
    imageSrc,
    imageAlt = "",
    variant = "full",
  }: Props = $props();
</script>

{#if variant === "full" && imageSrc}
  <section
    class="relative isolate min-h-[min(100svh,920px)] w-full overflow-hidden bg-canvas"
    aria-label={title}
  >
    <div class="absolute inset-0">
      <img
        src={imageSrc}
        alt={imageAlt}
        class="h-full w-full object-cover object-center"
        width="2400"
        height="1350"
        fetchpriority="high"
      />
      <!-- Readable overlay in both themes -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20"
        aria-hidden="true"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"
        aria-hidden="true"
      ></div>
    </div>

    <div
      class="container-editorial relative z-10 flex min-h-[min(100svh,920px)] flex-col justify-end pb-16 pt-28 md:pb-24 md:pt-32"
    >
      <div class="max-w-2xl text-white">
        <p class="hero-enter eyebrow mb-4 text-white/80">{eyebrow}</p>
        <h1 class="hero-enter-delay font-display text-display text-balance text-white">
          {title}
        </h1>
        {#if subtitle}
          <p
            class="hero-enter-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
          >
            {subtitle}
          </p>
        {/if}
        <div class="hero-enter-delay-2 mt-8 flex flex-wrap items-center gap-3">
          <a href={ctaHref} class="btn-primary">{ctaLabel}</a>
          {#if secondaryCtaHref && secondaryCtaLabel}
            <a
              href={secondaryCtaHref}
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/15"
            >
              {secondaryCtaLabel}
            </a>
          {/if}
        </div>
      </div>

      {#if scrollCue}
        <p
          class="mt-12 hidden text-xs uppercase tracking-[0.14em] text-white/55 md:block"
        >
          {scrollCue}
        </p>
      {/if}
    </div>
  </section>
{:else}
  <!-- Compact fallback (no image) -->
  <section class="section-y border-b border-[color:var(--border-hairline)]">
    <div class="container-editorial max-w-3xl">
      <p class="eyebrow mb-3 text-burgundy">{eyebrow}</p>
      <h1 class="font-display text-display text-balance text-primary">{title}</h1>
      {#if subtitle}
        <p class="mt-5 text-lg leading-relaxed text-secondary">{subtitle}</p>
      {/if}
      <div class="mt-8 flex flex-wrap gap-3">
        <a href={ctaHref} class="btn-primary">{ctaLabel}</a>
        {#if secondaryCtaHref && secondaryCtaLabel}
          <a href={secondaryCtaHref} class="btn-secondary">{secondaryCtaLabel}</a>
        {/if}
      </div>
    </div>
  </section>
{/if}
