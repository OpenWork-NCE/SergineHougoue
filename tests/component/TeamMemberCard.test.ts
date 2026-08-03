import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import TeamMemberCard from "$components/content/TeamMemberCard.svelte";
import { MEDIA } from "$lib/media";

describe("<TeamMemberCard>", () => {
  it("renders name, role and photo", () => {
    render(TeamMemberCard, {
      props: {
        member: {
          id: "steve",
          name: "Steve Djeuga",
          role: "Courtier hypothécaire",
          photoSrc: MEDIA.teamSteve,
          photoAlt: "Portrait de Steve Djeuga",
          order: 1,
          isLead: false,
        },
      },
    });

    expect(
      screen.getByRole("heading", { name: "Steve Djeuga" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Courtier hypothécaire")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Portrait de Steve Djeuga" }),
    ).toHaveAttribute("src", MEDIA.teamSteve);
  });
});
