import { describe, expect, it } from "vitest";

import config from "../../vercel.json";

const { redirects } = config;

describe("Vercel staging redirects", () => {
  const production = redirects.filter((rule) => !rule.has);

  it.each(production)("routes staging $source to the staging app before production", (rule) => {
    const staging = redirects.find(
      (candidate) =>
        candidate.source === rule.source &&
        candidate.has?.some(
          (condition) => condition.type === "host" && condition.value === "staging.glasspay.app",
        ),
    );
    expect(staging).toBeDefined();
    expect(staging.destination).toBe(
      rule.destination.replace("https://app.glasspay.app", "https://staging-app.glasspay.app"),
    );
    expect(staging.permanent).toBe(false);
    expect(redirects.indexOf(staging)).toBeLessThan(redirects.indexOf(rule));
    expect(rule.destination).toMatch(/^https:\/\/app\.glasspay\.app\//);
  });
});
