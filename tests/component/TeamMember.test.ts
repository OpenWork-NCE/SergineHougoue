import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/svelte";
import TeamMember from "$components/content/TeamMember.svelte";
import { mockTeamMember } from "../fixtures/teamMember";

describe("<TeamMember>", () => {
  // Env provided early via tests/setup.ts + vi.stubEnv (before this module + component loads)
  // + live reads in env.ts ensure urlFor in deriveds succeeds.

  it("renders photo, name, role, and bio", () => {
    // explicit stub for this test (setup default also sufficient)
    vi.stubEnv("PUBLIC_SANITY_PROJECT_ID", "test-project-id");
    vi.stubEnv("PUBLIC_SANITY_DATASET", "production");

    const member = mockTeamMember();

    render(TeamMember, { props: { member } });

    expect(
      screen.getByRole("heading", { level: 2, name: "Sergine Hougoue" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Courtier immobilier résidentiel"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Spécialisée dans l'accompagnement des premiers acheteurs/i,
      ),
    ).toBeInTheDocument();

    const image = screen.getByRole("img", {
      name: "Portrait de Sergine Hougoue",
    });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("cdn.sanity.io"),
    );
  });

  it("renders without photo when asset is missing", () => {
    const member = mockTeamMember({ photo: undefined });

    render(TeamMember, { props: { member } });

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Sergine Hougoue" }),
    ).toBeInTheDocument();
  });

  it("omits bio paragraph when blocks are empty", () => {
    const member = mockTeamMember({ bio: undefined });

    render(TeamMember, { props: { member } });

    expect(
      screen.getByRole("heading", { level: 2, name: "Sergine Hougoue" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Spécialisée dans l'accompagnement/i),
    ).not.toBeInTheDocument();
  });
});
