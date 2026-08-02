<script lang="ts">
  import PropertyGrid from "$components/content/PropertyGrid.svelte";
  import { getCopy } from "$i18n/copy";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);

  // Allys-inspired type filters (sensible here)
  let activeType = $state("All");
  const types = ["All", "Villa", "Apartment", "House", "Land"];

  const filtered = $derived(
    data.properties.filter((p: any) =>
      activeType === "All" || p.type?.toLowerCase() === activeType.toLowerCase()
    )
  );
</script>

<div class="border-b border-[color:var(--border-hairline)]">
  <div class="container-editorial py-8">
    <p class="eyebrow text-burgundy">{copy.listings.eyebrow}</p>
    <h1 class="font-display text-5xl text-primary mt-2">{copy.listings.title}</h1>
    <p class="max-w-xl mt-3 text-secondary">{copy.listings.intro}</p>
  </div>
</div>

<!-- Filter bar -->
<div class="border-b border-[color:var(--border-hairline)] bg-surface sticky top-16 z-40">
  <div class="container-editorial py-4 flex flex-wrap gap-2 items-center">
    {#each types as t}
      <button onclick={() => activeType = t} class="filter-pill {activeType === t ? 'active' : ''}">{t}</button>
    {/each}
    <span class="ml-auto text-sm text-secondary">{filtered.length} properties</span>
  </div>
</div>

<section class="container-editorial py-10 md:py-14">
  <PropertyGrid properties={filtered} locale={data.locale} basePath={base} />
</section>
