<script lang="ts">
  import { getCopy } from "$i18n/copy";
  import { urlFor } from "$sanity/image";
  import { plainTextFromBlocks } from "$sanity/portable-text";
  import { formatArea, formatPrice } from "$utils/format";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);
  const property = $derived(data.property);
  const detailCopy = $derived(copy.property.detail);
  const description = $derived(plainTextFromBlocks(property.description));
  const formattedPrice = $derived(formatPrice(property.price, data.locale));
  const typeLabel = $derived(copy.property.types[property.type]);
  const statusLabel = $derived(copy.property.statuses[property.status]);
  const mapQuery = $derived(
    encodeURIComponent(`${property.address}, ${property.city}`),
  );
  const mapHref = $derived(
    `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  );
  const galleryImages = $derived(
    (property.photos ?? []).map((photo, index) => ({
      src: urlFor(photo)
        .width(index === 0 ? 800 : 400)
        .height(index === 0 ? 600 : 300)
        .fit("crop")
        .url(),
      alt: photo.alt?.trim() || property.title,
    })),
  );
  const specs = $derived([
    { label: copy.property.beds, value: String(property.bedrooms) },
    { label: copy.property.baths, value: String(property.bathrooms) },
    {
      label: copy.property.area,
      value: formatArea(property.area, data.locale),
    },
    { label: detailCopy.type, value: typeLabel },
    { label: detailCopy.status, value: statusLabel },
    { label: detailCopy.price, value: formattedPrice },
  ]);
</script>

<article class="container-editorial pb-24 md:pb-32">
  <header class="py-16 md:py-24">
    <p class="eyebrow mb-4 text-gold">{copy.listings.eyebrow}</p>
    <h1 class="font-display text-5xl text-balance text-primary md:text-6xl">
      {property.title}
    </h1>
    <p class="mt-4 text-lg text-secondary">
      {property.address}, {property.city}
      {#if property.neighborhood}
        <span class="text-secondary"> — {property.neighborhood}</span>
      {/if}
    </p>
    <p class="mt-2 font-display text-3xl text-gold">{formattedPrice}</p>
  </header>

  {#if galleryImages.length > 0}
    <section aria-label="Property photos" class="grid gap-4 md:grid-cols-2">
      {#each galleryImages as image, index (image.src)}
        <div
          class={index === 0
            ? "aspect-[4/3] overflow-hidden rounded-sm md:col-span-2"
            : "aspect-[4/3] overflow-hidden rounded-sm"}
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

  <div class="mt-16 grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
    <section>
      <h2 class="font-display text-3xl text-primary">{detailCopy.specs}</h2>
      <table class="mt-6 w-full border-collapse text-left">
        <tbody>
          {#each specs as spec (spec.label)}
            <tr class="border-t border-white/10">
              <th
                scope="row"
                class="py-3 pr-6 text-sm uppercase tracking-[0.08em] text-secondary"
              >
                {spec.label}
              </th>
              <td class="py-3 text-primary">{spec.value}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if property.features?.length}
        <h2 class="mt-12 font-display text-3xl text-primary">
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
      {#if description}
        <div>
          <h2 class="font-display text-3xl text-primary">
            {detailCopy.description}
          </h2>
          <p class="mt-6 text-lg leading-relaxed text-secondary">
            {description}
          </p>
        </div>
      {/if}

      <div>
        <h2 class="font-display text-3xl text-primary">
          {detailCopy.location}
        </h2>
        <p class="mt-4 text-secondary">
          {property.address}, {property.city}
        </p>
        <a
          href={mapHref}
          target="_blank"
          rel="noopener noreferrer"
          class="mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.08em] text-gold transition-transform hover:translate-x-1"
        >
          {detailCopy.mapLink}
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <a
        href={`${base}/contact`}
        class="inline-flex items-center justify-center rounded-sm border border-gold/40 px-6 py-3 text-sm uppercase tracking-[0.08em] text-gold transition-colors hover:bg-gold/10"
      >
        {detailCopy.contactCta}
      </a>
    </section>
  </div>
</article>
