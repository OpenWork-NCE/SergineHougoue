<script lang="ts">
  interface Props {
    eyebrow: string;
    title: string;
    subtitle?: string;
    ctaHref: string;
    ctaLabel: string;
    imageSrc?: string;
  }

  let { eyebrow, title, subtitle, ctaHref, ctaLabel, imageSrc }: Props =
    $props();
</script>

<section class="flex min-h-[80vh] items-center">
  <div class="container-editorial grid items-center gap-12 md:grid-cols-2">
    <div>
      <p class="eyebrow mb-4 text-gold">{eyebrow}</p>
      <h1 class="font-display text-5xl text-balance text-primary md:text-7xl">
        {title}
      </h1>
      {#if subtitle}
        <p class="mt-6 max-w-2xl text-lg text-secondary">{subtitle}</p>
      {/if}
      <a
        href={ctaHref}
        class="mt-8 inline-block rounded-full border border-burgundy bg-burgundy px-6 py-3 text-xs uppercase tracking-[0.08em] text-primary transition-colors hover:bg-[#8a2638]"
      >
        {ctaLabel}
      </a>
    </div>

    {#if imageSrc}
      <div class="aspect-[4/5] overflow-hidden rounded-sm">
        <img src={imageSrc} alt="" class="h-full w-full object-cover" />
      </div>
    {/if}
  </div>
</section>