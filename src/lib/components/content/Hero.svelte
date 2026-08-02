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

<section class="py-10 md:py-16">
  <div class="container-editorial grid md:grid-cols-12 gap-8 md:gap-12 items-center">
    <!-- Left: text -->
    <div class="md:col-span-7">
      <p class="eyebrow mb-3 text-burgundy">{eyebrow}</p>
      <h1 class="font-display text-5xl md:text-6xl lg:text-7xl text-balance text-primary tracking-[-0.02em]">
        {title}
      </h1>
      {#if subtitle}
        <p class="mt-5 max-w-2xl text-lg text-secondary leading-relaxed">{subtitle}</p>
      {/if}
      <a href={ctaHref} class="btn-primary mt-8 inline-flex text-base">
        {ctaLabel}
      </a>
    </div>

    <!-- Right: image (Profil.png) -->
    {#if imageSrc}
      <div class="md:col-span-5 mt-8 md:mt-0">
        <img
          src={imageSrc}
          alt="Profil"
          class="w-full h-auto max-h-[480px] md:max-h-[520px] object-cover rounded-2xl shadow-xl border border-[color:var(--border-hairline)]"
        />
      </div>
    {/if}
  </div>
</section>