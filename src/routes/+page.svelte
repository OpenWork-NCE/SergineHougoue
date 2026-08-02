<script lang="ts">
  import Hero from "$components/content/Hero.svelte";
  import PropertyCard from "$components/content/PropertyCard.svelte";
  import TestimonialChip from "$components/content/TestimonialChip.svelte";
  import { getCopy } from "$i18n/copy";
  import { getQuebecRegions } from "$i18n/regions";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);
  const regions = getQuebecRegions();

  // Simple client-side filters inspired by Allys (makes sense for properties)
  let activeType = $state("All");
  const types = ["All", "Villa", "Apartment", "House", "Land"];

  const filteredProperties = $derived(
    (data.featuredProperties || []).filter((p: any) => {
      if (activeType === "All") return true;
      return p.type?.toLowerCase() === activeType.toLowerCase();
    })
  );
</script>

<Hero
  eyebrow={copy.hero.eyebrow}
  title={copy.hero.title}
  subtitle={data.siteSettings?.tagline?.trim() || copy.hero.subtitle}
  ctaHref={`${base}/contact`}
  ctaLabel={copy.nav.cta}
  imageSrc="/Profil.png"
/>

<!-- Allys-style filter bar (adapted, only sensible filters) -->
{#if data.featuredProperties.length > 0}
  <div class="border-y border-[color:var(--border-hairline)] bg-surface">
    <div class="container-editorial py-4 flex flex-wrap items-center gap-3">
      <span class="text-xs uppercase tracking-wider text-secondary mr-2">Filter by type</span>
      {#each types as type}
        <button
          class="filter-pill {activeType === type ? 'active' : ''}"
          onclick={() => activeType = type}
        >
          {type}
        </button>
      {/each}
      <a href={`${base}/biens`} class="ml-auto text-sm text-burgundy hover:underline">View all properties →</a>
    </div>
  </div>

  <!-- Featured properties restructured as clean grid -->
  <section class="container-editorial py-14 md:py-20">
    <h2 class="font-display text-3xl text-primary mb-8">{copy.home.featuredProperties}</h2>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredProperties.slice(0, 6) as property (property._id)}
        <PropertyCard {property} locale={data.locale} basePath={base} />
      {/each}
    </div>
  </section>
{/if}

{#if data.testimonials.length > 0}
  <section class="container-editorial py-12 md:py-16 border-t border-[color:var(--border-hairline)]">
    <h2 class="font-display text-3xl text-primary mb-8">{copy.home.testimonials}</h2>
    <div class="flex flex-wrap gap-6">
      {#each data.testimonials as testimonial (testimonial._id)}
        <TestimonialChip {testimonial} />
      {/each}
    </div>
  </section>
{/if}

<section
  class="container-editorial py-14 md:py-20 border-t border-[color:var(--border-hairline)]"
  aria-labelledby="territory-heading"
>
  <h2 id="territory-heading" class="font-display text-3xl text-primary mb-3">
    {copy.home.territoryTitle}
  </h2>
  <p class="text-secondary max-w-2xl mb-8">{copy.home.territoryIntro}</p>
  <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {#each regions as region}
      <li
        class="rounded-lg border border-[color:var(--border-hairline)] bg-surface px-3 py-2 text-sm text-primary"
      >
        {region}
      </li>
    {/each}
  </ul>
</section>

<!-- Restructured CTA -->
<section class="container-editorial py-16 md:py-20 text-center border-t border-[color:var(--border-hairline)]">
  <h2 class="font-display text-3xl text-primary mb-4">{copy.ctaStrip.title}</h2>
  <a href={`${base}/contact`} class="btn-primary inline-block mt-2">{copy.nav.cta}</a>
</section>