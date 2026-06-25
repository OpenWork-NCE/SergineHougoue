<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import PortableTextRenderer from "$components/content/PortableTextRenderer.svelte";
  import TestimonialChip from "$components/content/TestimonialChip.svelte";
  import { getCopy } from "$i18n/copy";
  import { urlFor } from "$sanity/image";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const member = $derived(data.teamMembers[0]);

  const photoUrl = $derived(
    member?.photo?.asset
      ? urlFor(member.photo).width(800).height(1000).fit("crop").url()
      : "/Profil.png"
  );

  const testimonials = $derived(data.testimonials ?? []);
</script>

<PageHeader
  eyebrow={copy.about.eyebrow}
  title={copy.about.title}
  intro={copy.about.intro}
/>

<!-- Profile / Portfolio Intro -->
<section class="container-editorial pb-16 md:pb-24">
  <div class="grid items-start gap-10 md:grid-cols-12">
    <div class="md:col-span-7 space-y-8 text-lg leading-relaxed text-secondary">
      {#if member?.bio?.length}
        <div>
          <PortableTextRenderer blocks={member.bio} />
        </div>
      {:else}
        <p>
          {copy.about.bioFallback}
        </p>
      {/if}

      <div class="pt-4 border-t border-white/10">
        <h3 class="font-display text-xl text-primary mb-3">{copy.about.journeyTitle}</h3>
        <p>
          {copy.about.journey}
        </p>
      </div>

      <div>
        <h3 class="font-display text-xl text-primary mb-3">{copy.about.approachTitle}</h3>
        <ul class="space-y-2 text-base">
          {#each copy.about.approach as item, index}
            <li class="flex gap-3">
              <span class="text-burgundy">{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <div class="md:col-span-5 mt-8 md:mt-0">
      <div class="sticky top-24">
        <div class="aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <img
            src={photoUrl}
            alt={member?.name ?? "Sergine Hougoue"}
            class="h-full w-full object-cover"
          />
        </div>
        {#if member}
          <div class="mt-6">
            <p class="font-display text-3xl text-primary">{member.name}</p>
            <p class="mt-1 text-sm uppercase tracking-[0.08em] text-gold">
              {member.role}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Expertise -->
<section class="border-t border-white/10 py-16 md:py-20 bg-surface/50">
  <div class="container-editorial">
    <div class="max-w-2xl mb-10">
      <p class="eyebrow text-burgundy">{copy.about.expertiseTitle}</p>
      <h2 class="font-display text-3xl text-primary mt-2">{copy.about.expertiseTitle}</h2>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      {#each copy.about.expertise as area}
        <div class="card p-8">
          <h3 class="font-display text-2xl mb-3">{area.title}</h3>
          <p class="text-secondary">{area.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Testimonials -->
{#if testimonials.length > 0}
  <section class="container-editorial py-16 md:py-24">
    <div class="max-w-2xl mb-10">
      <p class="eyebrow text-burgundy">{copy.about.testimonialsTitle}</p>
      <h2 class="font-display text-3xl text-primary mt-2">{copy.about.testimonialsHeading}</h2>
    </div>

    <div class="flex flex-wrap gap-6">
      {#each testimonials.slice(0, 6) as testimonial (testimonial._id)}
        <TestimonialChip {testimonial} />
      {/each}
    </div>
  </section>
{/if}

<!-- Final CTA -->
<section class="border-t border-white/10 py-16 md:py-20">
  <div class="container-editorial text-center">
    <h2 class="font-display text-3xl text-primary mb-4">{copy.about.ctaTitle}</h2>
    <p class="text-secondary max-w-md mx-auto mb-8">{copy.about.ctaSubtitle}</p>
    <a href="/contact" class="btn-primary">{copy.nav.cta}</a>
  </div>
</section>