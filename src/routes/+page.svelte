<script lang="ts">
  import Hero from "$components/content/Hero.svelte";
  import PropertyCarousel from "$components/content/PropertyCarousel.svelte";
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
  <section class="container-editorial pb-24 md:pb-32">
    <h2 class="font-display text-3xl text-primary md:text-4xl">
      {copy.home.testimonials}
    </h2>
    <ul class="mt-8 space-y-8">
      {#each data.testimonials as testimonial (testimonial._id)}
        <li class="max-w-3xl border-t border-white/10 pt-6">
          <blockquote class="text-lg leading-relaxed text-secondary">
            “{testimonial.quote}”
          </blockquote>
          <p class="mt-4 text-sm uppercase tracking-[0.08em] text-gold">
            {testimonial.authorName}
            {#if testimonial.authorContext}
              <span class="text-secondary"> — {testimonial.authorContext}</span>
            {/if}
          </p>
        </li>
      {/each}
    </ul>
  </section>
{/if}