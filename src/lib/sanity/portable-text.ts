import type { PortableTextBlock } from "@portabletext/types";

/** Extracts plain text from Sanity portable text blocks for simple display. */
export function plainTextFromBlocks(blocks?: PortableTextBlock[]): string {
  if (!blocks?.length) return "";

  return blocks
    .filter((block) => block._type === "block")
    .flatMap((block) => block.children ?? [])
    .map((child) => ("text" in child ? String(child.text) : ""))
    .join(" ")
    .trim();
}
