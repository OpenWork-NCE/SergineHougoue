<script lang="ts">
  import PortableTextRenderer from "$components/content/PortableTextRenderer.svelte";
  import { getCopy } from "$i18n/copy";
  import { urlFor } from "$sanity/image";
  import { formatDate } from "$utils/format";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const post = $derived(data.post);
  const categoryLabel = $derived(copy.blog.categories[post.category]);
  const formattedDate = $derived(formatDate(post.publishedAt, data.locale));
  const coverSrc = $derived(
    post.coverImage?.asset?._ref
      ? urlFor(post.coverImage).width(1200).height(675).url()
      : null,
  );
  const coverAlt = $derived(post.coverImage?.alt?.trim() || post.title);
  const authorPhotoSrc = $derived(
    post.author?.photo?.asset?._ref
      ? urlFor(post.author.photo).width(96).height(96).fit("crop").url()
      : null,
  );
</script>

<article class="container-editorial pb-24 md:pb-32">
  <header class="py-16 md:py-24">
    <p class="eyebrow mb-4 text-gold">{copy.blog.eyebrow}</p>
    <p class="mb-4 text-xs uppercase tracking-[0.08em] text-gold">
      {categoryLabel}
    </p>
    <h1 class="font-display text-5xl text-balance text-primary md:text-6xl">
      {post.title}
    </h1>
    <p class="mt-4 text-sm text-secondary">{post.excerpt}</p>

    <div class="mt-8 flex flex-wrap items-center gap-4 text-sm text-secondary">
      {#if authorPhotoSrc}
        <img
          src={authorPhotoSrc}
          alt={post.author.name}
          class="h-12 w-12 rounded-full object-cover"
        />
      {/if}
      <p>
        {copy.blog.detail.byAuthor}
        <span class="text-primary">{post.author.name}</span>
      </p>
      <span class="text-secondary/60" aria-hidden="true">·</span>
      <p>
        {copy.blog.detail.publishedOn}
        <time datetime={post.publishedAt} class="text-primary">
          {formattedDate}
        </time>
      </p>
    </div>
  </header>

  {#if coverSrc}
    <div class="aspect-video overflow-hidden rounded-sm">
      <img
        src={coverSrc}
        alt={coverAlt}
        class="h-full w-full object-cover"
      />
    </div>
  {/if}

  {#if post.body?.length}
    <PortableTextRenderer blocks={post.body} class="mt-16 max-w-3xl" />
  {/if}
</article>