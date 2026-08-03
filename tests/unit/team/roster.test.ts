import { describe, expect, it } from "vitest";
import { getStaticTeamRoster } from "$lib/team/roster";
import { MEDIA } from "$lib/media";

describe("getStaticTeamRoster", () => {
  it("returns four members with expected identities (FR)", () => {
    const roster = getStaticTeamRoster("fr");
    expect(roster).toHaveLength(4);

    const byId = Object.fromEntries(roster.map((m) => [m.id, m]));

    expect(byId.sergine?.name).toBe("Sergine Hougoue");
    expect(byId.sergine?.isLead).toBe(true);
    expect(byId.sergine?.photoSrc).toBe(MEDIA.teamPortrait);

    expect(byId.steve?.name).toBe("Steve Djeuga");
    expect(byId.steve?.role).toMatch(/hypothécaire/i);
    expect(byId.steve?.photoSrc).toBe(MEDIA.teamSteve);

    expect(byId.sara?.name).toBe("Sara");
    expect(byId.sara?.role).toMatch(/hypothécaire/i);
    expect(byId.sara?.photoSrc).toBe(MEDIA.teamSara);

    expect(byId.guy?.name).toBe("Guy");
    expect(byId.guy?.role).toMatch(/Inspecteur/i);
    expect(byId.guy?.photoSrc).toBe(MEDIA.teamDefault);
  });

  it("returns English roles for en locale", () => {
    const roster = getStaticTeamRoster("en");
    const steve = roster.find((m) => m.id === "steve");
    const guy = roster.find((m) => m.id === "guy");
    expect(steve?.role).toMatch(/Mortgage broker/i);
    expect(guy?.role).toMatch(/inspector/i);
  });
});
