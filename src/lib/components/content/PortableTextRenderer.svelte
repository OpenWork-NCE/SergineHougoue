<script lang="ts">
  import type { PortableTextBlock } from "@portabletext/types";
  import { PortableText } from "@portabletext/svelte";
  import BulletList from "./portable-text/BulletList.svelte";
  import BulletListItem from "./portable-text/BulletListItem.svelte";
  import Heading from "./portable-text/Heading.svelte";
  import NormalParagraph from "./portable-text/NormalParagraph.svelte";

  interface Props {
    blocks?: PortableTextBlock[];
    class?: string;
  }

  let { blocks = [], class: className = "" }: Props = $props();
</script>

{#if blocks.length > 0}
  <div class="space-y-4 {className}">
    <PortableText
      value={blocks}
      onMissingComponent={false}
      components={{
        block: {
          normal: NormalParagraph,
          h2: Heading,
        },
        list: {
          bullet: BulletList,
        },
        listItem: {
          bullet: BulletListItem,
        },
      }}
    />
  </div>
{/if}