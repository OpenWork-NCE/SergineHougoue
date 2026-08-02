import { describe, expect, it } from "vitest";
import { QUEBEC_REGIONS, getQuebecRegions } from "$i18n/regions";

describe("QUEBEC_REGIONS", () => {
  it("lists exactly 17 administrative regions", () => {
    expect(getQuebecRegions()).toHaveLength(17);
    expect(QUEBEC_REGIONS).toContain("Montréal");
    expect(QUEBEC_REGIONS).toContain("Gaspésie–Îles-de-la-Madeleine");
    expect(QUEBEC_REGIONS).toContain("Saguenay–Lac-Saint-Jean");
  });
});
