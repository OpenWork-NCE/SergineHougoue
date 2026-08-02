<script lang="ts">
  import PropertyGrid from "$components/content/PropertyGrid.svelte";
  import { getCopy } from "$i18n/copy";
  import type { PropertyType } from "$sanity/types";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);

  let activeType = $state<PropertyType | "all">("all");

  const typeKeys = $derived(
    Object.keys(copy.property.types) as PropertyType[],
  );

  const filtered = $derived(
    data.properties.filter((p) =>
      activeType === "all" ? true : p.type === activeType,
    ),
  );
</script>

<header class="border-b border-[color:var(--border-hairline)]">
  <div class="container-editorial py-14 md:py-20">
    <p class="eyebrow text-burgundy">{copy.listings.eyebrow}</p>
    <h1 class="font-display text-display text-primary mt-2">
      {copy.listings.title}
    </h1>
    <p class="max-w-xl mt-4 text-lg text-secondary">{copy.listings.intro}</p>
  </div>
</header>

<div
  class="sticky top-16 z-40 border-b border-[color:var(--border-hairline)] bg-canvas/90 backdrop-blur-md md:top-[4.5rem]"
>
  <div
    class="container-editorial flex flex-wrap items-center gap-2 py-3.5 md:py-4"
  >
    <button
      type="button"
      class="filter-pill {activeType === 'all' ? 'active' : ''}"
      onclick={() => (activeType = "all")}
    >
      {copy.listings.filterAll}
    </button>
    {#each typeKeys as t}
      <button
        type="button"
        class="filter-pill {activeType === t ? 'active' : ''}"
        onclick={() => (activeType = t)}
      >
        {copy.property.types[t]}
      </button>
    {/each}
    <span class="ml-auto text-sm text-secondary tabular-nums">
      {filtered.length}
      {copy.listings.countLabel}
    </span>
  </div>
</div>

<section class="container-editorial py-12 md:py-16">
  <PropertyGrid properties={filtered} locale={data.locale} basePath={base} />
</section>
