<script lang="ts">
  import type { Property } from "$sanity/types";
  import type { Locale } from "$i18n/locales";
  import { getCopy } from "$i18n/copy";
  import { formatArea, formatPrice } from "$utils/format";
  import { urlFor } from "$sanity/image";

  interface Props {
    property: Property;
    locale: Locale;
    basePath: string;
  }

  let { property, locale, basePath }: Props = $props();

  const copy = $derived(getCopy(locale));
  const detailHref = $derived(`${basePath}/biens/${property.slug.current}`);
  const formattedPrice = $derived(formatPrice(property.price, locale));
  const typeLabel = $derived(copy.property.types[property.type]);
  const statusLabel = $derived(copy.property.statuses[property.status]);
  const photo = $derived(property.photos?.[0]);
  const imageSrc = $derived(
    photo ? urlFor(photo).width(800).height(600).url() : null,
  );
  const imageAlt = $derived(photo?.alt?.trim() || property.title);
  const specs = $derived(
    `${property.bedrooms} ${copy.property.beds} · ${property.bathrooms} ${copy.property.baths} · ${formatArea(property.area, locale)}`,
  );
</script>

<!-- Restructured Property Card inspired by Allys cleanliness + current burgundy theme -->
<article class="card group">
  <a href={detailHref} class="block focus-visible:outline-none">
    <div class="relative aspect-[4/3] overflow-hidden">
      {#if imageSrc}
        <img
          src={imageSrc}
          alt={imageAlt}
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      {:else}
        <div class="h-full w-full bg-white/5" aria-hidden="true"></div>
      {/if}

      {#if property.status !== "a-vendre"}
        <span
          class="absolute left-3 top-3 rounded-lg px-3 py-1 text-[10px] font-medium uppercase tracking-wider {property.status === 'vendu' ? 'bg-burgundy text-primary' : 'bg-gold text-canvas'}"
        >
          {statusLabel}
        </span>
      {/if}
    </div>

    <div class="p-5 space-y-2.5">
      <div class="font-display text-2xl text-gold tracking-tight">{formattedPrice}</div>

      <div>
        <p class="font-medium text-primary leading-snug">{property.address}{property.city ? `, ${property.city}` : ''}</p>
        <p class="mt-1 text-sm text-secondary">{specs}</p>
      </div>

      <div class="flex items-center justify-between pt-1">
        <span class="text-xs uppercase tracking-[0.08em] text-secondary">{typeLabel}</span>
        <span class="inline-flex items-center gap-1 text-xs font-medium text-burgundy group-hover:translate-x-0.5 transition-transform">
          {copy.property.viewDetail} →
        </span>
      </div>
    </div>
  </a>
</article>