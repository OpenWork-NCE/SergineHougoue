<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<div class="container-editorial py-24">
  <p class="eyebrow mb-4 text-gold">01 / Courtier immobilier</p>
  <h1 class="font-display text-5xl md:text-6xl text-balance text-primary">
    Construisons votre avenir immobilier
  </h1>
  <p class="mt-6 text-secondary text-lg max-w-2xl">
    Active locale: <code class="text-accent">{data.locale}</code>
  </p>
</div>