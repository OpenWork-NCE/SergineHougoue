<script lang="ts">
  import "../app.css";
  import Nav from "$components/layout/Nav.svelte";
  import type { LayoutData } from "./$types";

  interface Props {
    data: LayoutData;
    children?: import("svelte").Snippet;
  }
  let { data, children }: Props = $props();
</script>

<Nav currentPath={`/${data.locale}/`} locale={data.locale} />

<main>
  {@render children?.()}
</main>