# Testing strategy

## Current approach

This repo runs **Vitest** in a jsdom environment, mirroring `glass-waitlist`'s test setup (same test framework, same CI treatment). Tests are colocated next to the module they cover, matching this repo's existing convention.

What's tested today:

- `src/utils/deviceRedirect.test.js` — the `goToApp` / `buildMobileUrl` /
  mobile-detection redirect logic. This is the most important seam on the
  marketing site: it's what keeps visitors going to `app.glasspay.app`
  instead of a route that doesn't exist here.
- `src/lib/cloudinary.test.js` — URL building (`cldUrl`, `cldSrcSet`) and
  the `CloudImage` LQIP component (placeholder swap, priority handling,
  srcSet).

## What is not unit-tested (and why that's OK)

- Landing sections (Hero, CTASection, HowItWorks, ...) are visual and
  ported as-is from `glass-waitlist`; targeted render tests add little
  against the porting risk (which is "did the copy drift", caught by
  eyeballing the two sites side by side, not by unit assertions).
- Animations (`BlurText`, `VariableProximity`, Motion) are largely
  imperative/DOM-timing code; testing them is brittle.

## CI

The same gate order as `glass-waitlist`: `format:check`, lint, typecheck,
test, build — see `.github/workflows/ci.yml`. `npm run format` fixes
formatting locally; formatting drift in an existing file fails the gate the
same way it does in the app repo.

## Gaps for later sprints

- An integration test around a representative `goToApp`<->component handoff
  (e.g. MembersHero's "Join A Community" redirect target) to lock the
  redirect seam down in both breakpoint branches.
- A shared test contract between this repo and `glass-waitlist` for the
  cloudinary helpers so the URL pattern can't drift silently.
