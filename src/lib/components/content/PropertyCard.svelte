<script lang="ts">
  import type { Locale } from "$i18n/locales";
  import { getCopy } from "$i18n/copy";
  import type { DisplayProperty } from "$lib/properties/types";
  import { propertyFallbackImage } from "$lib/media";
  import { formatArea, formatPrice } from "$utils/format";
  import { urlFor } from "$sanity/image";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import Bath from "lucide-svelte/icons/bath";
  import BedDouble from "lucide-svelte/icons/bed-double";
  import MapPin from "lucide-svelte/icons/map-pin";
  import Ruler from "lucide-svelte/icons/ruler";

  interface Props {
    property: DisplayProperty;
    locale: Locale;
    basePath: string;
    fallbackIndex?: number;
  }

  let { property, locale, basePath, fallbackIndex = 0 }: Props = $props();

  const copy = $derived(getCopy(locale));
  const detailHref = $derived(`${basePath}/biens/${property.slug.current}`);
  const typeLabel = $derived(copy.property.types[property.type]);
  const statusLabel = $derived(copy.property.statuses[property.status]);
  const photo = $derived(property.photos?.[0]);

  const imageSrc = $derived(
    property.staticImageSrc
      ? property.staticImageSrc
      : photo?.asset?._ref
        ? urlFor(photo).width(800).height(600).url()
        : propertyFallbackImage(fallbackIndex),
  );
  const imageAlt = $derived(
    property.photoAlt?.trim() ||
      photo?.alt?.trim() ||
      property.title,
  );

  const hasPrice = $derived(
    typeof property.price === "number" && Number.isFinite(property.price),
  );
  const hasBeds = $derived(
    typeof property.bedrooms === "number" && property.bedrooms >= 0,
  );
  const hasBaths = $derived(
    typeof property.bathrooms === "number" && property.bathrooms >= 0,
  );
  const hasArea = $derived(
    typeof property.area === "number" && property.area > 0,
  );
  const hasSpecs = $derived(hasBeds || hasBaths || hasArea);
  const locationLine = $derived(
    [property.address, property.city].filter(Boolean).join(", "),
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
          class="absolute left-3 top-3 rounded-lg px-3 py-1 text-[10px] font-medium uppercase tracking-wider {property.status ===
          'vendu'
            ? 'bg-burgundy text-on-brand'
            : 'bg-gold text-canvas'}"
        >
          {statusLabel}
        </span>
      {/if}
    </div>

    <div class="space-y-3 p-5">
      {#if hasPrice}
        <div class="font-display text-2xl tracking-tight text-gold-text">
          {formatPrice(property.price!, locale)}
        </div>
      {:else if property.status === "vendu"}
        <div class="font-display text-2xl tracking-tight text-burgundy">
          {statusLabel}
        </div>
      {/if}

      <div>
        <p class="font-medium leading-snug text-primary">{property.title}</p>
        {#if locationLine}
          <p class="mt-1.5 flex items-start gap-1.5 text-sm text-secondary">
            <MapPin
              class="mt-0.5 size-3.5 shrink-0 text-burgundy"
              aria-hidden="true"
            />
            <span>{locationLine}</span>
          </p>
        {/if}

        {#if hasSpecs}
          <ul class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-secondary">
            {#if hasBeds}
              <li class="inline-flex items-center gap-1.5">
                <BedDouble
                  class="size-3.5 shrink-0 text-burgundy"
                  aria-hidden="true"
                />
                <span>{property.bedrooms} {copy.property.beds}</span>
              </li>
            {/if}
            {#if hasBaths}
              <li class="inline-flex items-center gap-1.5">
                <Bath
                  class="size-3.5 shrink-0 text-burgundy"
                  aria-hidden="true"
                />
                <span>{property.bathrooms} {copy.property.baths}</span>
              </li>
            {/if}
            {#if hasArea}
              <li class="inline-flex items-center gap-1.5">
                <Ruler
                  class="size-3.5 shrink-0 text-burgundy"
                  aria-hidden="true"
                />
                <span>{formatArea(property.area!, locale)}</span>
              </li>
            {/if}
          </ul>
        {/if}
      </div>

      <div
        class="flex items-center justify-between border-t border-[color:var(--border-hairline)] pt-3"
      >
        <span class="text-xs uppercase tracking-[0.08em] text-secondary"
          >{typeLabel}</span
        >
        <span
          class="inline-flex items-center gap-1 text-xs font-medium text-burgundy transition-transform group-hover:translate-x-0.5"
        >
          {copy.property.viewDetail}
          <ArrowRight class="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </div>
  </a>
</article>
