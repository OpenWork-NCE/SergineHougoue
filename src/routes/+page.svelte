<script lang="ts">
  import CtaStrip from "$components/content/CtaStrip.svelte";
  import Hero from "$components/content/Hero.svelte";
  import PropertyCarousel from "$components/content/PropertyCarousel.svelte";
  import TestimonialChip from "$components/content/TestimonialChip.svelte";
  import { getCopy } from "$i18n/copy";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);
  const heroSubtitle = $derived(
    data.siteSettings?.tagline?.trim() || copy.hero.subtitle,
  );
</script>

<Hero
  eyebrow={copy.hero.eyebrow}
  title={copy.hero.title}
  subtitle={heroSubtitle}
  ctaHref={`${base}/contact`}
  ctaLabel={copy.nav.cta}
/>

{#if data.featuredProperties.length > 0}
  <section class="container-editorial py-16 md:py-24">
    <h2 class="font-display text-3xl text-primary md:text-4xl">
      {copy.home.featuredProperties}
    </h2>
    <div class="mt-8">
      <PropertyCarousel
        properties={data.featuredProperties}
        locale={data.locale}
        basePath={base}
      />
    </div>
  </section>
{/if}

{#if data.testimonials.length > 0}
  <section class="container-editorial py-16 md:py-24">
    <h2 class="font-display text-3xl text-primary md:text-4xl">
      {copy.home.testimonials}
    </h2>
    <div class="mt-8 flex flex-wrap gap-6">
      {#each data.testimonials as testimonial (testimonial._id)}
        <TestimonialChip {testimonial} />
      {/each}
    </div>
  </section>
{/if}

<CtaStrip
  title={copy.ctaStrip.title}
  ctaHref={`${base}/contact`}
  ctaLabel={copy.nav.cta}
/>