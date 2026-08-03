<script lang="ts">
  import PortableTextRenderer from "$components/content/PortableTextRenderer.svelte";
  import { getCopy } from "$i18n/copy";
  import { urlFor } from "$sanity/image";
  import { formatArea, formatPrice } from "$utils/format";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import MapPin from "lucide-svelte/icons/map-pin";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);
  const property = $derived(data.property);
  const detailCopy = $derived(copy.property.detail);
  const typeLabel = $derived(copy.property.types[property.type]);
  const statusLabel = $derived(copy.property.statuses[property.status]);

  const hasPrice = $derived(
    typeof property.price === "number" && Number.isFinite(property.price),
  );
  const hasAddress = $derived(Boolean(property.address?.trim()));

  const mapQuery = $derived(
    encodeURIComponent(
      [property.address, property.city].filter(Boolean).join(", "),
    ),
  );
  const mapHref = $derived(
    `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  );

  const galleryImages = $derived.by(() => {
    if (property.staticImageSrc) {
      return [
        {
          src: property.staticImageSrc,
          alt: property.photoAlt?.trim() || property.title,
        },
      ];
    }
    return (property.photos ?? []).map((photo, index) => ({
      src: urlFor(photo)
        .width(index === 0 ? 1200 : 600)
        .height(index === 0 ? 800 : 400)
        .fit("crop")
        .url(),
      alt: photo.alt?.trim() || property.title,
    }));
  });

  const specs = $derived.by(() => {
    const rows: { label: string; value: string }[] = [
      { label: detailCopy.type, value: typeLabel },
      { label: detailCopy.status, value: statusLabel },
    ];
    if (typeof property.bedrooms === "number") {
      rows.push({
        label: copy.property.beds,
        value: String(property.bedrooms),
      });
    }
    if (typeof property.bathrooms === "number") {
      rows.push({
        label: copy.property.baths,
        value: String(property.bathrooms),
      });
    }
    if (typeof property.area === "number" && property.area > 0) {
      rows.push({
        label: copy.property.area,
        value: formatArea(property.area, data.locale),
      });
    }
    if (hasPrice) {
      rows.push({
        label: detailCopy.price,
        value: formatPrice(property.price!, data.locale),
      });
    }
    return rows;
  });
</script>

<article class="container-editorial pb-16 md:pb-20">
  <header class="border-b border-[color:var(--border-hairline)] py-12 md:py-16">
    <p class="eyebrow mb-2 text-burgundy">{copy.listings.eyebrow}</p>
    <h1
      class="font-display text-balance text-5xl tracking-tight text-primary md:text-6xl"
    >
      {property.title}
    </h1>
    <p class="mt-3 flex items-center gap-2 text-lg text-secondary">
      <MapPin class="size-4 shrink-0 text-burgundy" aria-hidden="true" />
      <span>
        {#if hasAddress}{property.address}, {/if}{property.city}
        {#if property.neighborhood}
          <span> — {property.neighborhood}</span>
        {/if}
      </span>
    </p>
    {#if hasPrice}
      <p class="mt-3 font-display text-3xl text-gold-text">
        {formatPrice(property.price!, data.locale)}
      </p>
    {:else if property.status === "vendu"}
      <p class="mt-3 font-display text-3xl text-burgundy">{statusLabel}</p>
    {/if}
  </header>

  {#if galleryImages.length > 0}
    <section aria-label="Property photos" class="mt-8 grid gap-4 md:grid-cols-2">
      {#each galleryImages as image, index (image.src)}
        <div
          class={index === 0
            ? "aspect-[4/3] overflow-hidden rounded-2xl md:col-span-2"
            : "aspect-[4/3] overflow-hidden rounded-2xl"}
        >
          <img
            src={image.src}
            alt={image.alt}
            class="h-full w-full object-cover"
          />
        </div>
      {/each}
    </section>
  {/if}

  <div class="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
    <section>
      <h2 class="mb-6 font-display text-3xl text-primary">{detailCopy.specs}</h2>
      <div class="card p-6">
        <dl class="divide-y divide-[color:var(--border-hairline)]">
          {#each specs as spec (spec.label)}
            <div class="flex justify-between py-3 text-sm">
              <dt class="uppercase tracking-[0.08em] text-secondary">
                {spec.label}
              </dt>
              <dd class="font-medium text-primary">{spec.value}</dd>
            </div>
          {/each}
        </dl>
      </div>

      {#if property.features?.length}
        <h2 class="mt-10 font-display text-3xl text-primary">
          {detailCopy.features}
        </h2>
        <ul class="mt-6 space-y-3 text-secondary">
          {#each property.features as feature (feature)}
            <li class="flex items-start gap-3">
              <span class="mt-1 text-gold" aria-hidden="true">•</span>
              <span>{feature}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <section class="space-y-12">
      {#if property.description?.length}
        <div>
          <h2 class="font-display text-3xl text-primary">
            {detailCopy.description}
          </h2>
          <PortableTextRenderer
            blocks={property.description}
            class="mt-6"
          />
        </div>
      {/if}

      <div>
        <h2 class="font-display text-3xl text-primary">
          {detailCopy.location}
        </h2>
        <p class="mt-4 text-secondary">
          {#if hasAddress}{property.address}, {/if}{property.city}
        </p>
        <a
          href={mapHref}
          target="_blank"
          rel="noopener noreferrer"
          class="mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.08em] text-gold-text transition-transform hover:translate-x-1"
        >
          {detailCopy.mapLink}
          <ArrowRight class="size-3.5" aria-hidden="true" />
        </a>
      </div>

      <a href={`${base}/contact`} class="btn-primary inline-flex">
        {detailCopy.contactCta}
      </a>
    </section>
  </div>
</article>
