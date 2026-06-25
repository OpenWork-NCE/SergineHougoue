import type { PortableTextBlock } from "@portabletext/types";
import type { TeamMember } from "$sanity/types";

function bioBlock(text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: "bio-block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "bio-span",
        text,
        marks: [],
      },
    ],
  };
}

export function mockTeamMember(
  overrides: Partial<TeamMember> = {},
): TeamMember {
  return {
    _id: "team-member-sergine-hougoue-fr",
    _type: "teamMember",
    name: "Sergine Hougoue",
    role: "Courtier immobilier résidentiel",
    photo: {
      _type: "image",
      asset: {
        _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
        _type: "reference",
      },
      alt: "Portrait de Sergine Hougoue",
    },
    bio: [
      bioBlock(
        "Spécialisée dans l'accompagnement des premiers acheteurs et des investisseurs sur la Rive-Nord et à Montréal.",
      ),
    ],
    order: 0,
    ...overrides,
  };
}