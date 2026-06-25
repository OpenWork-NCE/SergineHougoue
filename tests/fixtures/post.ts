import type { Post } from "$sanity/types";

export function mockPost(overrides: Partial<Post> = {}): Post {
  return {
    _id: "post-acheter-plex-montreal",
    _type: "post",
    title: "Acheter un plex à Montréal : par où commencer ?",
    slug: { current: "acheter-plex-montreal" },
    excerpt:
      "Guide pratique pour les premiers acheteurs qui envisagent un plex résidentiel à Montréal.",
    coverImage: {
      _type: "image",
      asset: {
        _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
        _type: "reference",
      },
      alt: "Façade d'un plex à Montréal",
    },
    category: "investir",
    author: {
      _id: "team-member-sergine-hougoue-fr",
      name: "Sergine Hougoue",
      photo: {
        _type: "image",
        asset: {
          _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
          _type: "reference",
        },
        alt: "Portrait de Sergine Hougoue",
      },
    },
    publishedAt: "2026-01-15T00:00:00.000Z",
    ...overrides,
  };
}