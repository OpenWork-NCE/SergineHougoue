<script lang="ts">
  import type { Post } from "$sanity/types";
  import type { Locale } from "$i18n/locales";
  import { getCopy } from "$i18n/copy";
  import { blogFallbackImage } from "$lib/media";
  import { urlFor } from "$sanity/image";
  import ArrowRight from "lucide-svelte/icons/arrow-right";

  interface Props {
    post: Post;
    locale: Locale;
    basePath: string;
    fallbackIndex?: number;
  }

  let { post, locale, basePath, fallbackIndex = 0 }: Props = $props();

  const copy = $derived(getCopy(locale));
  const detailHref = $derived(`${basePath}/blog/${post.slug.current}`);
  const categoryLabel = $derived(copy.blog.categories[post.category]);
  const coverSrc = $derived(
    post.coverImage?.asset?._ref
      ? urlFor(post.coverImage).width(1200).height(675).url()
      : blogFallbackImage(fallbackIndex),
  );
  const coverAlt = $derived(post.coverImage?.alt?.trim() || post.title);
</script>

<article class="card group">
  <a href={detailHref} class="block focus-visible:outline-none">
    <div class="relative aspect-video overflow-hidden bg-surface">
      <img
        src={coverSrc}
        alt={coverAlt}
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        loading="lazy"
        width="1200"
        height="675"
      />

      <span class="absolute left-3 top-3 rounded-lg px-3 py-1 text-[10px] font-medium uppercase tracking-wider bg-gold text-canvas">
        {categoryLabel}
      </span>
    </div>

    <div class="p-5 space-y-2.5">
      <h2 class="font-display text-2xl text-primary">{post.title}</h2>
      <p class="text-sm leading-relaxed text-secondary">{post.excerpt}</p>
      <div class="pt-1">
        <span
          class="inline-flex items-center gap-1 text-xs font-medium text-burgundy transition-transform group-hover:translate-x-0.5"
        >
          {copy.blog.readMore}
          <ArrowRight class="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </div>
  </a>
</article>