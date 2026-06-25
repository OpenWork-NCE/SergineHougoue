<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<ul class="mt-4 list-disc space-y-3 pl-6 text-secondary">
  {@render children()}
</ul>