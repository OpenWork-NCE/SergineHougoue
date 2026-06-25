import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import PortableTextRenderer from "$components/content/PortableTextRenderer.svelte";
import { mockPortableTextBlocks } from "../fixtures/portableText";

describe("<PortableTextRenderer>", () => {
  it("renders paragraph text and a bullet list from fixture blocks", () => {
    render(PortableTextRenderer, {
      props: { blocks: mockPortableTextBlocks() },
    });

    expect(screen.getByText(/Paragraph with/i)).toBeInTheDocument();

    const bold = screen.getByText("bold");
    expect(bold.tagName).toBe("STRONG");

    const italic = screen.getByText("italic");
    expect(italic.tagName).toBe("EM");

    expect(
      screen.getByRole("heading", { level: 2, name: "Section title" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByText("Second item")).toBeInTheDocument();
  });

  it("renders no rich text content when blocks are empty", () => {
    render(PortableTextRenderer, { props: { blocks: [] } });

    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});