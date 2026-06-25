<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<p class="text-lg leading-relaxed text-secondary">
  {@render children()}
</p>