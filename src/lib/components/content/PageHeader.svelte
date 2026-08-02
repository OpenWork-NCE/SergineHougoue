<script lang="ts">
  interface Props {
    eyebrow: string;
    title: string;
    intro?: string;
  }

  let { eyebrow, title, intro }: Props = $props();
</script>

<header class="border-b border-[color:var(--border-hairline)]">
  <div class="container-editorial py-14 md:py-20 lg:py-24">
    <p class="eyebrow mb-3 text-burgundy">{eyebrow}</p>
    <h1 class="font-display text-display max-w-4xl text-balance text-primary">
      {title}
    </h1>
    {#if intro}
      <p class="mt-5 max-w-2xl text-lg leading-relaxed text-secondary">
        {intro}
      </p>
    {/if}
  </div>
</header>
