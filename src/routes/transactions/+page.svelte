<script lang="ts">
  import PageHeader from "$components/content/PageHeader.svelte";
  import PropertyGrid from "$components/content/PropertyGrid.svelte";
  import { getCopy } from "$i18n/copy";
  import { urlFor } from "$sanity/image";
  import type { Partner, PartnerCategory } from "$sanity/types";
  import type { PageData } from "./$types";

  const PARTNER_CATEGORY_ORDER: PartnerCategory[] = [
    "preteur",
    "notaire",
    "inspecteur",
    "autre",
  ];

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);

  const partnersByCategory = $derived(
    PARTNER_CATEGORY_ORDER.map((category) => ({
      category,
      label: copy.transactions.partnerCategories[category],
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
  eyebrow={copy.transactions.eyebrow}
  title={copy.transactions.title}
  intro={copy.transactions.intro}
/>

<section class="container-editorial pb-16 md:pb-24">
  <h2 class="eyebrow mb-8 text-burgundy">{copy.transactions.soldHeading}</h2>
  <PropertyGrid
    properties={data.soldProperties}
    locale={data.locale}
    basePath={base}
  />
</section>

{#if data.partners.length > 0}
  <section class="container-editorial border-t border-white/10 py-16 md:py-20">
    <h2 class="eyebrow mb-8 text-burgundy">{copy.transactions.partnersHeading}</h2>

    <div class="space-y-12">
      {#each partnersByCategory as group (group.category)}
        <div>
          <h3 class="mb-6 text-sm uppercase tracking-[0.08em] text-secondary">
            {group.label}
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {#each group.partners as partner (partner._id)}
              {@const logoSrc = partnerLogoSrc(partner)}
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                class="card group p-6 flex items-center justify-center hover:border-burgundy/30 transition-colors"
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
  </section>
{/if}