import type { PortableTextBlock } from "@portabletext/types";

export function mockPortableTextBlocks(): PortableTextBlock[] {
  return [
    {
      _type: "block",
      _key: "intro",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "intro-span-1",
          text: "Paragraph with ",
          marks: [],
        },
        {
          _type: "span",
          _key: "intro-span-2",
          text: "bold",
          marks: ["strong"],
        },
        {
          _type: "span",
          _key: "intro-span-3",
          text: " and ",
          marks: [],
        },
        {
          _type: "span",
          _key: "intro-span-4",
          text: "italic",
          marks: ["em"],
        },
        {
          _type: "span",
          _key: "intro-span-5",
          text: " text.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "heading",
      style: "h2",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "heading-span",
          text: "Section title",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "list-item-1",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "list-item-1-span",
          text: "First item",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "list-item-2",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "list-item-2-span",
          text: "Second item",
          marks: [],
        },
      ],
    },
  ];
}