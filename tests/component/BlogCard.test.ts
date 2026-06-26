import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import BlogCard from "$components/content/BlogCard.svelte";
import { mockPost } from "../fixtures/post";

describe("<BlogCard>", () => {
  // Env provided early via tests/setup.ts + vi.stubEnv (before this module + component loads)
  // + live reads in env.ts ensure urlFor in deriveds succeeds.

  it("renders cover, category, title, excerpt, and read link", () => {
    const post = mockPost();

    render(BlogCard, {
      props: {
        post,
        locale: "fr",
        basePath: "/fr",
      },
    });

    expect(
      screen.getByRole("heading", {
        name: "Acheter un plex à Montréal : par où commencer ?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Investir")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Guide pratique pour les premiers acheteurs qui envisagent un plex résidentiel à Montréal.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Lire l'article/i }),
    ).toHaveAttribute("href", "/fr/blog/acheter-plex-montreal");

    const image = screen.getByRole("img", {
      name: "Façade d'un plex à Montréal",
    });
    expect(image).toBeInTheDocument();
  });
});
