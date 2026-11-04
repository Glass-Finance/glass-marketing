import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cldUrl, cldSrcSet } from "./cloudinary";

const CLOUD = "ece5jmhy";

beforeEach(() => {
  vi.stubEnv("VITE_CLOUDINARY_CLOUD_NAME", CLOUD);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("cldUrl", () => {
  it("returns a default f_auto/q_auto/c_limit URL with no opts", () => {
    expect(cldUrl("glass/hero/hero")).toBe(
      `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_limit/glass/hero/hero`,
    );
  });

  it("applies width and dpr", () => {
    expect(cldUrl("glass/hero/hero", { width: 1920, dpr: 2 })).toMatch(
      /\/f_auto,q_auto,c_limit,w_1920,dpr_2\/glass\/hero\/hero$/,
    );
  });

  it("preserves SVG delivery when requested", () => {
    expect(cldUrl("glass/solution/automate", { width: 800, format: "svg" })).toBe(
      `https://res.cloudinary.com/${CLOUD}/image/upload/f_svg,q_auto,c_limit,w_800/glass/solution/automate`,
    );
  });

  it("applies blur as a low-quality placeholder variant", () => {
    const url = cldUrl("glass/hero/hero", { blur: true });
    expect(url).toContain("e_blur:1200");
    expect(url).toContain("q_auto:low");
    expect(url).toContain("w_32");
  });

  it("respects a custom crop and quality", () => {
    expect(cldUrl("glass/Glass", { crop: "fill", quality: 80 })).toContain(
      "f_auto,q_80,c_fill/glass/Glass",
    );
  });
});

describe("cldSrcSet", () => {
  it("builds a 'url widthw' list joined by commas", () => {
    const set = cldSrcSet("glass/hero/hero", [400, 800, 1200]);
    const entries = set.split(", ").map((e) => e.trim());
    expect(entries).toHaveLength(3);
    expect(entries[1]).toBe(
      `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_limit,w_800/glass/hero/hero 800w`,
    );
  });

  it("forwards the requested delivery format to each srcSet URL", () => {
    const set = cldSrcSet("glass/solution/automate", [400, 800], { format: "svg" });
    expect(set).toContain(
      `https://res.cloudinary.com/${CLOUD}/image/upload/f_svg,q_auto,c_limit,w_400/glass/solution/automate 400w`,
    );
    expect(set).toContain(
      `https://res.cloudinary.com/${CLOUD}/image/upload/f_svg,q_auto,c_limit,w_800/glass/solution/automate 800w`,
    );
  });
});
