<script lang="ts">
  import BlogCard from "$components/content/BlogCard.svelte";
  import PageHeader from "$components/content/PageHeader.svelte";
  import { getCopy } from "$i18n/copy";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const copy = $derived(getCopy(data.locale));
  const base = $derived(`/${data.locale}`);
  const showPagination = $derived(data.totalPages > 1);
  const previousHref = $derived(
    data.page > 1 ? `${base}/blog?page=${data.page - 1}` : null,
  );
  const nextHref = $derived(
    data.page < data.totalPages ? `${base}/blog?page=${data.page + 1}` : null,
  );
</script>

<PageHeader
  eyebrow={copy.blog.eyebrow}
  title={copy.blog.title}
  intro={copy.blog.intro}
/>

<section class="container-editorial pb-16 md:pb-24">
  {#if data.posts.length > 0}
    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.posts as post (post._id)}
        <BlogCard {post} locale={data.locale} basePath={base} />
      {/each}
    </div>
  {/if}

  {#if showPagination}
    <nav
      class="mt-16 flex items-center justify-between border-t border-white/10 pt-8"
      aria-label={copy.blog.pagination.pageLabel}
    >
      {#if previousHref}
        <a
          href={previousHref}
          class="text-sm uppercase tracking-[0.08em] text-gold transition-transform hover:translate-x-[-2px]"
        >
          ← {copy.blog.pagination.previous}
        </a>
      {:else}
        <span></span>
      {/if}

      <p class="text-sm text-secondary">
        {copy.blog.pagination.pageLabel}
        {data.page}
        <span class="text-secondary/60">/ {data.totalPages}</span>
      </p>

      {#if nextHref}
        <a
          href={nextHref}
          class="text-sm uppercase tracking-[0.08em] text-gold transition-transform hover:translate-x-1"
        >
          {copy.blog.pagination.next} →
        </a>
      {:else}
        <span></span>
      {/if}
    </nav>
  {/if}
</section>