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

<article class="group">
  <a href={detailHref} class="block focus-visible:outline-none">
    <div class="relative aspect-[4/3] overflow-hidden rounded-sm">
      {#if imageSrc}
        <img
          src={imageSrc}
          alt={imageAlt}
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      {:else}
        <div class="h-full w-full bg-white/5" aria-hidden="true"></div>
      {/if}

      {#if property.status !== "a-vendre"}
        <span
          class="absolute left-3 top-3 rounded-full px-3 py-1 text-xs uppercase tracking-[0.08em] {property.status ===
          'vendu'
            ? 'bg-burgundy text-primary'
            : 'border border-gold/40 bg-[#1a1a1a]/80 text-gold'}"
        >
          {statusLabel}
        </span>
      {/if}
    </div>

    <div class="mt-4 space-y-2">
      <p class="font-display text-2xl text-gold">{formattedPrice}</p>
      <p class="text-base text-primary">
        {property.address}, {property.city}
      </p>
      <p class="text-sm text-secondary">{specs}</p>
      <p class="text-xs uppercase tracking-[0.08em] text-secondary">
        {typeLabel}
      </p>
      <span
        class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-gold transition-transform group-hover:translate-x-1"
      >
        {copy.property.viewDetail}
        <span aria-hidden="true">→</span>
      </span>
    </div>
  </a>
</article>