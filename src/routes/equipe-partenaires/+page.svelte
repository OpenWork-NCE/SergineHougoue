<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import { getCopy } from "$i18n/copy";
  import { MEDIA } from "$lib/media";
  import { urlFor } from "$sanity/image";
  import type { Partner, PartnerCategory } from "$sanity/types";
  import type { PageData } from "./$types";

  const PARTNER_CATEGORY_ORDER: PartnerCategory[] = [
    "preteur",
    "courtier-hypothecaire",
    "notaire",
    "inspecteur",
    "autre",
  ];

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const member = $derived(data.teamMembers[0]);

  const photoUrl = $derived(
    member?.photo?.asset
      ? urlFor(member.photo).width(800).height(1000).fit("crop").url()
      : MEDIA.teamPortrait,
  );

  const partnersByCategory = $derived(
    PARTNER_CATEGORY_ORDER.map((category) => ({
      category,
      label: copy.teamPartners.partnerCategories[category],
      partners: data.partners.filter(
        (partner) => partner.category === category,
      ),
    })).filter((group) => group.partners.length > 0),
  );

  function partnerLogoSrc(partner: Partner): string | null {
    if (!partner.logo?.asset?._ref) {
      return null;
    }

    return urlFor(partner.logo).width(240).height(120).fit("max").url();
  }
</script>

<PageHeader
  eyebrow={copy.teamPartners.eyebrow}
  title={copy.teamPartners.title}
  intro={copy.teamPartners.intro}
/>

<section class="container-editorial pb-16">
  <h2 class="eyebrow mb-6 text-burgundy">{copy.teamPartners.teamHeading}</h2>

  <div class="grid items-start gap-10 md:grid-cols-12">
    <div class="md:col-span-5">
      <div
        class="aspect-[4/5] overflow-hidden rounded-2xl border border-[color:var(--border-hairline)] bg-surface"
      >
        <img
          src={photoUrl}
          alt={member?.name ?? copy.teamPartners.teamFallbackName}
          class="h-full w-full object-cover"
        />
      </div>
    </div>

    <div class="md:col-span-7 md:pt-4">
      <p class="font-display text-3xl text-primary md:text-4xl">
        {member?.name ?? copy.teamPartners.teamFallbackName}
      </p>
      <p class="mt-2 text-sm uppercase tracking-[0.08em] text-gold-text">
        {member?.role ?? copy.teamPartners.teamFallbackRole}
      </p>
    </div>
  </div>
</section>

<section
  class="container-editorial border-t border-[color:var(--border-hairline)] py-16 md:py-20"
>
  <h2 class="eyebrow mb-8 text-burgundy">{copy.teamPartners.partnersHeading}</h2>

  {#if data.partners.length > 0}
    <div class="space-y-12">
      {#each partnersByCategory as group (group.category)}
        <div>
          <h3 class="mb-6 text-sm uppercase tracking-[0.08em] text-secondary">
            {group.label}
          </h3>
          <div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {#each group.partners as partner (partner._id)}
              {@const logoSrc = partnerLogoSrc(partner)}
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                class="card group flex items-center justify-center p-6 transition-colors hover:border-burgundy/30"
              >
                {#if logoSrc}
                  <img
                    src={logoSrc}
                    alt={partner.name}
                    class="max-h-12 w-auto max-w-[10rem] object-contain opacity-80 transition-opacity group-hover:opacity-100"
                  />
                {:else}
                  <span class="text-sm uppercase tracking-[0.08em] text-primary">
                    {partner.name}
                  </span>
                {/if}
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-secondary">{copy.teamPartners.emptyPartners}</p>
  {/if}
</section>
