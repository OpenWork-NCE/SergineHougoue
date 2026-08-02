<script lang="ts">
  import type { Property } from "$sanity/types";
  import type { Locale } from "$i18n/locales";
  import { getCopy } from "$i18n/copy";
  import { propertyFallbackImage } from "$lib/media";
  import { formatArea, formatPrice } from "$utils/format";
  import { urlFor } from "$sanity/image";

  interface Props {
    property: Property;
    locale: Locale;
    basePath: string;
    fallbackIndex?: number;
  }

  let { property, locale, basePath, fallbackIndex = 0 }: Props = $props();

  const copy = $derived(getCopy(locale));
  const detailHref = $derived(`${basePath}/biens/${property.slug.current}`);
  const formattedPrice = $derived(formatPrice(property.price, locale));
  const typeLabel = $derived(copy.property.types[property.type]);
  const statusLabel = $derived(copy.property.statuses[property.status]);
  const photo = $derived(property.photos?.[0]);
  const imageSrc = $derived(
    photo?.asset?._ref
      ? urlFor(photo).width(800).height(600).url()
      : propertyFallbackImage(fallbackIndex),
  );
  const imageAlt = $derived(photo?.alt?.trim() || property.title);
  const specs = $derived(
    `${property.bedrooms} ${copy.property.beds} · ${property.bathrooms} ${copy.property.baths} · ${formatArea(property.area, locale)}`,
  );
</script>

<article class="card group">
  <a href={detailHref} class="block focus-visible:outline-none">
    <div class="relative aspect-[4/3] overflow-hidden bg-surface">
      <img
        src={imageSrc}
        alt={imageAlt}
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        loading="lazy"
        width="800"
        height="600"
      />

      {#if property.status !== "a-vendre"}
        <span
          class="absolute left-3 top-3 rounded-lg px-3 py-1 text-[10px] font-medium uppercase tracking-wider {property.status === 'vendu' ? 'bg-burgundy text-on-brand' : 'bg-gold text-canvas'}"
        >
          {statusLabel}
        </span>
      {/if}
    </div>

    <div class="p-5 space-y-2.5">
      <div class="font-display text-2xl text-gold-text tracking-tight">{formattedPrice}</div>

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