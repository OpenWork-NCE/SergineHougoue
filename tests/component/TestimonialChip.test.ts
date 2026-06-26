import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/svelte";
import TestimonialChip from "$components/content/TestimonialChip.svelte";
import { mockTestimonial } from "../fixtures/testimonial";

describe("<TestimonialChip>", () => {
  // Env provided early via tests/setup.ts + vi.stubEnv (before this module + component loads)
  // + live reads in env.ts ensure urlFor in deriveds succeeds.

  it("renders quote, author, context, and accessible star rating", () => {
    const testimonial = mockTestimonial();

    render(TestimonialChip, { props: { testimonial } });

    expect(
      screen.getByText(/Sergine nous a guidés avec patience à chaque étape/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Marie-Claire B.")).toBeInTheDocument();
    expect(
      screen.getByText(/Première acheteuse, Montréal/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "5 out of 5 stars" }),
    ).toBeInTheDocument();
  });

  it("renders author photo when provided", () => {
    // setup stub already provides valid id; explicit for test clarity (live read)
    vi.stubEnv("PUBLIC_SANITY_PROJECT_ID", "test-project-id");
    vi.stubEnv("PUBLIC_SANITY_DATASET", "production");

    const testimonial = mockTestimonial({
      photo: {
        _type: "image",
        asset: {
          _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
          _type: "reference",
        },
        alt: "Portrait de Marie-Claire B.",
      },
    });

    render(TestimonialChip, { props: { testimonial } });

    const image = screen.getByRole("img", {
      name: "Portrait de Marie-Claire B.",
    });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("cdn.sanity.io"),
    );
  });

  it("omits author photo when not provided", () => {
    const testimonial = mockTestimonial({ photo: undefined });

    render(TestimonialChip, { props: { testimonial } });

    expect(
      screen.queryByRole("img", { name: /portrait/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "5 out of 5 stars" }),
    ).toBeInTheDocument();
  });
});
