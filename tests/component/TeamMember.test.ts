import { afterEach, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import TeamMember from "$components/content/TeamMember.svelte";
import { mockTeamMember } from "../fixtures/teamMember";

describe("<TeamMember>", () => {
  const originalProjectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const originalDataset = import.meta.env.PUBLIC_SANITY_DATASET;

  afterEach(() => {
    import.meta.env.PUBLIC_SANITY_PROJECT_ID = originalProjectId;
    import.meta.env.PUBLIC_SANITY_DATASET = originalDataset;
  });

  it("renders photo, name, role, and bio", () => {
    import.meta.env.PUBLIC_SANITY_PROJECT_ID = "test-project-id";
    import.meta.env.PUBLIC_SANITY_DATASET = "production";

    const member = mockTeamMember();

    render(TeamMember, { props: { member } });

    expect(
      screen.getByRole("heading", { level: 2, name: "Sergine Hougoue" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Courtier immobilier résidentiel"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Spécialisée dans l'accompagnement des premiers acheteurs/i),
    ).toBeInTheDocument();

    const image = screen.getByRole("img", {
      name: "Portrait de Sergine Hougoue",
    });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining("cdn.sanity.io"));
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