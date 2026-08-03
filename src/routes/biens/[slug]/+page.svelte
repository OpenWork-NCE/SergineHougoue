<script lang="ts">
  import PortableTextRenderer from "$components/content/PortableTextRenderer.svelte";
  import PropertyGallery from "$components/content/PropertyGallery.svelte";
  import { getCopy } from "$i18n/copy";
  import { resolvePropertyGalleryImages } from "$lib/properties/gallery";
  import { urlFor } from "$sanity/image";
  import { formatArea, formatPrice } from "$utils/format";
  import ArrowLeft from "lucide-svelte/icons/arrow-left";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import Bath from "lucide-svelte/icons/bath";
  import BedDouble from "lucide-svelte/icons/bed-double";
  import MapPin from "lucide-svelte/icons/map-pin";
  import Ruler from "lucide-svelte/icons/ruler";
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
  const hasBeds = $derived(
    typeof property.bedrooms === "number" && property.bedrooms >= 0,
  );
  const hasBaths = $derived(
    typeof property.bathrooms === "number" && property.bathrooms >= 0,
  );
  const hasArea = $derived(
    typeof property.area === "number" && property.area > 0,
  );
  const isSold = $derived(property.status === "vendu");

  const backHref = $derived(
    isSold ? `${base}/transactions` : `${base}/biens`,
  );
  const backLabel = $derived(
    isSold ? detailCopy.backToTransactions : detailCopy.backToListings,
  );

  const mapQuery = $derived(
    encodeURIComponent(
      [property.address, property.city].filter(Boolean).join(", "),
    ),
  );
  const mapHref = $derived(
    `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  );

  const galleryImages = $derived(
    resolvePropertyGalleryImages(property, {
      photoUrl: (photo, index) =>
        urlFor(photo)
          .width(index === 0 ? 1600 : 800)
          .height(index === 0 ? 1000 : 500)
          .fit("crop")
          .url(),
    }),
  );

  const priceLabel = $derived(
    hasPrice ? formatPrice(property.price!, data.locale) : null,
  );

  const statusTone = $derived(
    property.status === "vendu"
      ? ("sold" as const)
      : property.status === "en-primeur"
        ? ("primeur" as const)
        : ("none" as const),
  );

  const specs = $derived.by(() => {
    const rows: { label: string; value: string }[] = [
      { label: detailCopy.type, value: typeLabel },
      { label: detailCopy.status, value: statusLabel },
    ];
    if (hasBeds) {
      rows.push({
        label: copy.property.beds,
        value: String(property.bedrooms),
      });
    }
    if (hasBaths) {
      rows.push({
        label: copy.property.baths,
        value: String(property.bathrooms),
      });
    }
    if (hasArea) {
      rows.push({
        label: copy.property.area,
        value: formatArea(property.area!, data.locale),
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

  const highlightStats = $derived.by(() => {
    const items: {
      icon: "bed" | "bath" | "area";
      label: string;
      value: string;
    }[] = [];
    if (hasBeds) {
      items.push({
        icon: "bed",
        label: copy.property.beds,
        value: String(property.bedrooms),
      });
    }
    if (hasBaths) {
      items.push({
        icon: "bath",
        label: copy.property.baths,
        value: String(property.bathrooms),
      });
    }
    if (hasArea) {
      items.push({
        icon: "area",
        label: copy.property.area,
        value: formatArea(property.area!, data.locale),
      });
    }
    return items;
  });
</script>

<article class="pb-16 md:pb-24">
  <div class="container-editorial pt-8 md:pt-12">
    <a
      href={backHref}
      class="inline-flex min-h-11 items-center gap-2 text-sm text-secondary transition-colors hover:text-primary"
    >
      <ArrowLeft class="size-4" aria-hidden="true" />
      {backLabel}
    </a>

    <header class="mt-6 max-w-4xl">
      <p class="eyebrow mb-2 text-burgundy">
        {isSold ? copy.transactions.eyebrow : copy.listings.eyebrow}
      </p>
      <h1
        class="font-display text-balance text-4xl tracking-tight text-primary md:text-5xl lg:text-6xl"
      >
        {property.title}
      </h1>
      <p class="mt-3 flex items-start gap-2 text-base text-secondary md:text-lg">
        <MapPin
          class="mt-1 size-4 shrink-0 text-burgundy"
          aria-hidden="true"
        />
        <span>
          {#if hasAddress}{property.address}, {/if}{property.city}
          {#if property.neighborhood}
            <span class="text-muted"> · {property.neighborhood}</span>
          {/if}
        </span>
      </p>
    </header>

    <div class="mt-8 md:mt-10">
      <PropertyGallery
        images={galleryImages}
        statusLabel={statusTone !== "none" ? statusLabel : undefined}
        {statusTone}
        priceLabel={hasPrice ? priceLabel : null}
        galleryLabel={detailCopy.gallery}
        previousLabel={detailCopy.galleryPrevious}
        nextLabel={detailCopy.galleryNext}
        thumbnailsLabel={detailCopy.thumbnails}
      />
    </div>
  </div>

  <div
    class="container-editorial mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start lg:gap-12"
  >
    <div class="space-y-12 min-w-0">
      {#if highlightStats.length > 0}
        <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {#each highlightStats as stat (stat.label)}
            <li
              class="rounded-2xl border border-[color:var(--border-hairline)] bg-surface px-4 py-4"
            >
              <div class="flex items-center gap-2 text-burgundy">
                {#if stat.icon === "bed"}
                  <BedDouble class="size-4" aria-hidden="true" />
                {:else if stat.icon === "bath"}
                  <Bath class="size-4" aria-hidden="true" />
                {:else}
                  <Ruler class="size-4" aria-hidden="true" />
                {/if}
                <span class="text-xs uppercase tracking-[0.08em] text-secondary"
                  >{stat.label}</span
                >
              </div>
              <p class="mt-2 font-display text-2xl tracking-tight text-primary">
                {stat.value}
              </p>
            </li>
          {/each}
        </ul>
      {/if}

      {#if property.description?.length}
        <section>
          <h2 class="font-display text-3xl text-primary">
            {detailCopy.description}
          </h2>
          <PortableTextRenderer
            blocks={property.description}
            class="mt-6"
          />
        </section>
      {/if}

      {#if property.features?.length}
        <section>
          <h2 class="font-display text-3xl text-primary">
            {detailCopy.features}
          </h2>
          <ul class="mt-6 grid gap-3 sm:grid-cols-2">
            {#each property.features as feature (feature)}
              <li
                class="flex items-start gap-3 rounded-xl border border-[color:var(--border-hairline)] bg-surface/60 px-4 py-3 text-secondary"
              >
                <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true"
                ></span>
                <span>{feature}</span>
              </li>
            {/each}
          </ul>
        </section>
      {/if}

      <section>
        <h2 class="font-display text-3xl text-primary">
          {detailCopy.location}
        </h2>
        <div
          class="mt-6 rounded-2xl border border-[color:var(--border-hairline)] bg-surface p-6"
        >
          <p class="flex items-start gap-2 text-secondary">
            <MapPin
              class="mt-0.5 size-4 shrink-0 text-burgundy"
              aria-hidden="true"
            />
            <span>
              {#if hasAddress}{property.address}, {/if}{property.city}
              {#if property.neighborhood}
                <span> · {property.neighborhood}</span>
              {/if}
            </span>
          </p>
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold-text transition-transform hover:translate-x-0.5"
          >
            {detailCopy.mapLink}
            <ArrowRight class="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>

    <aside class="lg:sticky lg:top-28">
      <div class="card p-6 shadow-sm">
        {#if hasPrice}
          <p class="eyebrow text-secondary">{detailCopy.price}</p>
          <p class="mt-1 font-display text-3xl tracking-tight text-gold-text">
            {priceLabel}
          </p>
        {:else if isSold}
          <p class="eyebrow text-secondary">{detailCopy.status}</p>
          <p class="mt-1 font-display text-3xl tracking-tight text-burgundy">
            {statusLabel}
          </p>
        {:else}
          <p class="eyebrow text-secondary">{detailCopy.status}</p>
          <p class="mt-1 font-display text-2xl tracking-tight text-primary">
            {statusLabel}
          </p>
        {/if}

        <p class="mt-2 text-sm text-secondary">
          {typeLabel}
          {#if property.city}
            <span class="text-muted"> · {property.city}</span>
          {/if}
        </p>

        <dl class="mt-6 divide-y divide-[color:var(--border-hairline)]">
          {#each specs as spec (spec.label)}
            <div class="flex items-baseline justify-between gap-4 py-3 text-sm">
              <dt class="uppercase tracking-[0.08em] text-secondary">
                {spec.label}
              </dt>
              <dd class="text-right font-medium text-primary">{spec.value}</dd>
            </div>
          {/each}
        </dl>

        <a
          href={`${base}/contact`}
          class="btn-primary mt-6 w-full text-sm"
        >
          {detailCopy.contactCta}
        </a>
      </div>
    </aside>
  </div>
</article>
