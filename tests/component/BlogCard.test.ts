import { afterEach, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import BlogCard from "$components/content/BlogCard.svelte";
import { mockPost } from "../fixtures/post";

describe("<BlogCard>", () => {
  const originalProjectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const originalDataset = import.meta.env.PUBLIC_SANITY_DATASET;

  afterEach(() => {
    import.meta.env.PUBLIC_SANITY_PROJECT_ID = originalProjectId;
    import.meta.env.PUBLIC_SANITY_DATASET = originalDataset;
  });

  it("renders cover, category, title, excerpt, and read link", () => {
    import.meta.env.PUBLIC_SANITY_PROJECT_ID = "test-project-id";
    import.meta.env.PUBLIC_SANITY_DATASET = "production";

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