<script lang="ts">
  import type { Property } from "$sanity/types";
  import type { Locale } from "$i18n/locales";
  import PropertyCard from "./PropertyCard.svelte";

  interface Props {
    properties: Property[];
    locale: Locale;
    basePath: string;
  }

  let { properties, locale, basePath }: Props = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each properties as property (property._id)}
    <PropertyCard {property} {locale} {basePath} />
  {/each}
</div>