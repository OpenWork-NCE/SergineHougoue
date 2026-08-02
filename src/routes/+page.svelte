<script lang="ts">
  import Hero from "$components/content/Hero.svelte";
  import PropertyCard from "$components/content/PropertyCard.svelte";
  import TestimonialChip from "$components/content/TestimonialChip.svelte";
  import { reveal } from "$lib/actions/reveal";
  import { getCopy } from "$i18n/copy";
  import { getQuebecRegions } from "$i18n/regions";
  import { MEDIA } from "$lib/media";
  import type { PropertyType } from "$sanity/types";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);
  const regions = getQuebecRegions();

  let activeType = $state<PropertyType | "all">("all");

  const typeKeys = $derived(
    Object.keys(copy.property.types) as PropertyType[],
  );

  const filteredProperties = $derived(
    (data.featuredProperties || []).filter((p) => {
      if (activeType === "all") return true;
      return p.type === activeType;
    }),
  );
</script>

<Hero
  eyebrow={copy.hero.eyebrow}
  title={copy.hero.title}
  subtitle={data.siteSettings?.tagline?.trim() || copy.hero.subtitle}
  ctaHref={`${base}/contact`}
  ctaLabel={copy.nav.cta}
  secondaryCtaHref={`${base}/biens`}
  secondaryCtaLabel={copy.hero.secondaryCta}
  scrollCue={copy.hero.scrollCue}
  imageSrc={MEDIA.heroHome}
  imageAlt={copy.hero.title}
  variant="full"
/>

<!-- Featured listings -->
<section class="section-y border-b border-[color:var(--border-hairline)]">
  <div class="container-editorial" use:reveal>
    <div
      class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <h2 class="font-display text-section text-primary">
        {copy.home.featuredProperties}
      </h2>
      <a
        href={`${base}/biens`}
        class="text-sm font-medium text-burgundy transition-colors hover:underline"
      >
        {copy.home.viewAllListings} →
      </a>
    </div>

    {#if data.featuredProperties.length > 0}
      <div class="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          class="filter-pill {activeType === 'all' ? 'active' : ''}"
          onclick={() => (activeType = "all")}
        >
          {copy.home.filterAll}
        </button>
        {#each typeKeys as type}
          <button
            type="button"
            class="filter-pill {activeType === type ? 'active' : ''}"
            onclick={() => (activeType = type)}
          >
            {copy.property.types[type]}
          </button>
        {/each}
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each filteredProperties.slice(0, 6) as property, i (property._id)}
          <div use:reveal={{ delay: Math.min(i, 5) * 50 }}>
            <PropertyCard
              {property}
              locale={data.locale}
              basePath={base}
              fallbackIndex={i}
            />
          </div>
        {/each}
      </div>
    {:else}
      <p class="max-w-xl text-secondary">{copy.home.emptyListings}</p>
      <a href={`${base}/contact`} class="btn-primary mt-6 inline-flex">
        {copy.nav.cta}
      </a>
    {/if}
  </div>
</section>

<!-- Why / approach -->
<section class="section-y border-b border-[color:var(--border-hairline)]">
  <div class="container-editorial">
    <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div class="lg:col-span-5" use:reveal>
        <div
          class="aspect-[4/5] overflow-hidden rounded-2xl border border-[color:var(--border-hairline)] bg-surface"
        >
          <img
            src={MEDIA.homeWhy}
            alt=""
            class="h-full w-full object-cover"
            loading="lazy"
            width="1200"
            height="1500"
          />
        </div>
      </div>
      <div class="lg:col-span-7" use:reveal={{ delay: 80 }}>
        <p class="eyebrow text-burgundy mb-3">02 /</p>
        <h2 class="font-display text-section text-primary mb-4">
          {copy.home.whyTitle}
        </h2>
        <p class="max-w-xl text-secondary leading-relaxed mb-10">
          {copy.home.whyIntro}
        </p>
        <ul class="space-y-8">
          {#each copy.home.why as item, index}
            <li class="flex gap-4">
              <span
                class="font-display text-2xl text-burgundy tabular-nums shrink-0"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 class="font-display text-xl text-primary mb-1">
                  {item.title}
                </h3>
                <p class="text-secondary text-sm md:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>

{#if data.testimonials.length > 0}
  <section class="section-y border-b border-[color:var(--border-hairline)]">
    <div class="container-editorial" use:reveal>
      <h2 class="font-display text-section text-primary mb-10">
        {copy.home.testimonials}
      </h2>
      <div class="flex flex-wrap gap-6">
        {#each data.testimonials as testimonial (testimonial._id)}
          <TestimonialChip {testimonial} />
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- Territory -->
<section
  class="section-y border-b border-[color:var(--border-hairline)]"
  aria-labelledby="territory-heading"
>
  <div class="container-editorial" use:reveal>
    <h2
      id="territory-heading"
      class="font-display text-section text-primary mb-3"
    >
      {copy.home.territoryTitle}
    </h2>
    <p class="text-secondary max-w-2xl mb-10">{copy.home.territoryIntro}</p>
    <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
      {#each regions as region}
        <li
          class="rounded-xl border border-[color:var(--border-hairline)] bg-surface px-3 py-2.5 text-sm text-primary"
        >
          {region}
        </li>
      {/each}
    </ul>
  </div>
</section>

<!-- Final CTA -->
<section class="section-y">
  <div class="container-editorial text-center" use:reveal>
    <h2 class="font-display text-section text-primary mb-6">
      {copy.ctaStrip.title}
    </h2>
    <a href={`${base}/contact`} class="btn-primary inline-flex">
      {copy.nav.cta}
    </a>
  </div>
</section>
