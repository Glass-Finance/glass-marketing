# Glass — Marketing Site

Glass is a community finance platform — communities collect dues, payment plans and settlements, and their members pay their own obligations through a mobile-first app.

This repository is the **public marketing site**: landing pages, legal pages, and marketing-only components. It is deployed at **glasspay.app** and contains no auth, no dashboards, no member app, and no backend calls at all. Anyone trying to sign up, sign in, or actually use the product is sent to the real application at **app.glasspay.app**, a completely separate repo and deployment ([`glass-waitlist`](https://github.com/Glass-Finance/glass-waitlist)).

> Named `glass-waitlist-v1` because it started life as `glass-waitlist`, the original landing page repo, before the actual application grew into its own separate codebase (the plain `glass-waitlist` repo). The two names are easy to mix up — see [Two-Repo Setup](#two-repo-setup).

---

## Tech Stack

Same core stack as `glass-waitlist`, minus everything app-specific — no React Query, no Axios, no auth:

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Framework  | React 19, React Router 7 (SPA)                          |
| Build      | Vite 7                                                  |
| Styling    | Tailwind CSS 4 (CSS-first, no config file)              |
| Animation  | Motion                                                  |
| Fonts      | Fontsource (Inter, DM Sans, Playfair Display, Urbanist) |
| Icons      | Lucide                                                  |
| Images     | Cloudinary                                              |
| Chat       | Crisp                                                   |
| Analytics  | Vercel Analytics                                        |
| Monitoring | Sentry (optional, env-gated)                            |
| Testing    | Vitest + Testing Library                                |
| Tooling    | ESLint 9, Prettier, tsc (`allowJs`, `checkJs: false`)   |

---

## Getting Started

```bash
npm install
cp .env.example .env   # fill in required values
npm run dev            # starts on http://localhost:5173
```

### Environment Variables

`VITE_CLOUDINARY_CLOUD_NAME` is the one required at **build time**: `import.meta.env.VITE_*` values are inlined by Vite when the bundle compiles, so if it's missing every image URL ships as `res.cloudinary.com/undefined/...` and the site renders as a blank page. `scripts/check-build-env.mjs` runs before `npm run build` and **fails the build** if it's absent. Set it in `.env`, in the Vercel project's Environment Variables, and in `.github/workflows/ci.yml` (CI supplies `ece5jmhy`).

| Variable                     | Required        | Purpose                                                                                                                                                                              |
| ---------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_CLOUDINARY_CLOUD_NAME` | **Yes**         | Cloudinary cloud name for image delivery. Required to build — missing it fails the build via `scripts/check-build-env.mjs`.                                                          |
| `VITE_APP_URL`               | No              | Origin of the real application that `goToApp()` redirects to. Defaults to `https://app.glasspay.app`, so it's safe to skip unless pointing at a different deployment (e.g. staging). |
| `VITE_CRISP_WEBSITE_ID`      | No              | Crisp chat widget ID (`CrispChat.jsx`, rendered from `Footer.jsx`). Leave unset to disable chat — the current default.                                                               |
| `VITE_SENTRY_DSN`            | Production: yes | Enables Sentry crash/error reporting (`src/utils/monitoring.js`). Production is configured; unset locally to disable monitoring.                                                     |

Upload-script-only credentials (`scripts/upload-assets-to-cloudinary.mjs`) are server-side values that are never shipped to the browser: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Keep them in `.env` (gitignored), not committed.

---

## Scripts

| Command                | Description                                                                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                                                                                                                                             |
| `npm run build`        | Production build to `dist/` — runs `scripts/check-build-env.mjs` first (fails if `VITE_CLOUDINARY_CLOUD_NAME` is missing), then `scripts/verify-cloudinary-build.mjs` |
| `npm run preview`      | Serve the production build locally                                                                                                                                    |
| `npm run lint`         | Run ESLint over the project                                                                                                                                           |
| `npm run format`       | Prettier write                                                                                                                                                        |
| `npm run format:check` | Prettier check                                                                                                                                                        |
| `npm run typecheck`    | `tsc --noEmit`                                                                                                                                                        |
| `npm run test`         | Vitest (single run)                                                                                                                                                   |
| `npm run test:watch`   | Vitest (watch mode)                                                                                                                                                   |

---

## Project Structure

```
src/
├── App.jsx               # Route table: "/", "/members", 5 legal pages, "*" → Home
├── main.jsx              # Entry point
├── assets/               # Design-handoff images, phone-hero media
├── components/
│   ├── organizations/        # "/" Organizations landing sections
│   ├── members/              # "/members" Members landing sections
│   ├── common/               # Shared sections (CTA, Problem, Solution), spinner, CloudImage
│   ├── legal/                # LegalPageLayout shell
│   ├── ui/                   # Small visual primitives (BlurText, VariableProximity)
│   ├── Navbar, Footer, Security, TrustedBy, WhyGlass, UseCases, Reveal
│   ├── CrispChat, ErrorBoundary, LoadingScreen
│   └── usecasePhotos.js
├── hooks/               # useSeoMeta, useScrollReveal
├── lib/                 # cloudinary.js — Cloudinary URL builder
├── pages/
│   ├── index.jsx             # "/" Organizations landing page
│   ├── MembersHome.jsx       # "/members" Members landing page
│   └── legal/                # Privacy, Terms, Cookies, Acceptable Use, Refund Policy
└── utils/
    ├── deviceRedirect.js     # goToApp() cross-domain navigation — see below
    └── monitoring.js         # Sentry wrapper, no-ops without VITE_SENTRY_DSN
```

---

## Architecture Overview

### Two-Repo Setup

| Repo                                                                | Deploys to         | What it is                                                                                                      |
| ------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------- |
| [`glass-waitlist`](https://github.com/Glass-Finance/glass-waitlist) | `app.glasspay.app` | The actual product — auth, onboarding, dashboards, member app. **Source of truth for landing-page components.** |
| `glass-waitlist-v1` (this repo)                                     | `glasspay.app`     | This repo — the public marketing site only.                                                                     |

**This repo does not independently design its landing pages.** Every component under `src/components/` (Navbar, Footer, Hero, ProblemSection, OurSolution, GetStarted, CTA, UseCases, TrustedBy, Security, Pricing, WhyGlass, the `howItWorks/` and `members/` trees, the legal pages) is a port of the same component in `glass-waitlist`. If the two ever look different, it's because a change landed in `glass-waitlist` and didn't get copied over here yet — that's a bug to fix, not an intentional difference, unless a specific instruction says otherwise.

### Landing Page Porting

**When `glass-waitlist`'s landing pages change, do this:**

1. Diff the changed component(s) against this repo's copy (same relative path under `src/components/`, `src/hooks/`, `src/pages/legal/`).
2. Copy the file over as-is. Almost everything ports with **zero changes** because both repos use an identically-named `goToApp(path, navigate)` helper (`src/utils/deviceRedirect.js` in both) — it does an internal SPA navigate on `app.glasspay.app` and a hard cross-origin redirect to `app.glasspay.app` from `glasspay.app`.
3. **The one thing to check on every port:** if the component calls `navigate("/some-app-route")` directly instead of through `goToApp`, that route doesn't exist on this domain — rewrite it to `goToApp("/some-app-route", navigate)`. (This bit `membersHero.jsx`, `membersHowItWorks.jsx`, and `membersCTA.jsx` the first time — they called `navigate(isMobileDevice() ? "/member/join" : mobileRequiredPath(...))` directly.)
4. Also check for **public-root asset references** (`src="/Glass.webp"` etc., not a bundled `import`) — those need the actual file copied into this repo's `public/` folder too, not just `src/assets/`. This is the easiest thing to miss since a missing bundled import breaks the build loudly, but a missing public-root file just silently 404s a broken image.
5. Run `npm run build && npm run lint` before pushing. Both repos share the same (deliberately relaxed) `eslint.config.js` — if lint fails here but not in `glass-waitlist`, the configs have drifted; fix the config, don't rewrite the component to dodge it.

If you're not sure whether something ported cleanly, spin up both dev servers side by side (`npm run dev` in each, different ports) and compare the same route.

### Cross-Domain Navigation

Two mechanisms send visitors to the application:

- **In-app:** `goToApp(path, navigate)` (`src/utils/deviceRedirect.js`) — used by components that need an SPA-style transition to `app.glasspay.app`. Never call raw `navigate()` for an app route; that route doesn't exist on this domain.
- **On request:** `vercel.json` `redirects` send deep links typed or crawled on `glasspay.app` — `/member/*`, `/invite`, `/invites`, `/sign-up`, `/sign-in`, `/forgot-password` — to their equivalents on `app.glasspay.app`.

If you add a new app route to the marketing site's navigation, it needs **both**: a `goToApp()` call in the component and a matching entry in `vercel.json` for the unauthenticated/crawled case.

---

## Domain Glossary

Terms used in this site's marketing copy. The application repo is the authority — see its [`docs/`](https://github.com/Glass-Finance/glass-waitlist/tree/main/docs) for the full definitions.

| Term             | Meaning                                                             |
| ---------------- | ------------------------------------------------------------------- |
| **Community**    | Top-level entity (school, cooperative, association).                |
| **Member**       | A user belonging to a community who owes/pays money.                |
| **Dues**         | Recurring amounts a community charges its members.                  |
| **Payment plan** | A recurring or one-time due set up for members.                     |
| **Obligation**   | One instance of a member owing against a plan.                      |
| **Transaction**  | A record of money moving (completed, failed, pending).              |
| **Settlement**   | Payout of collected funds to a community's bank account.            |
| **KYC**          | Identity verification (Smile ID) required for community management. |

---

## Contributing

1. Create a short-lived `feature/` or `fix/` branch from `main`.
2. Run the full validation suite before opening a PR:

   ```bash
   npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build
   ```

   (`npm run build` needs `VITE_CLOUDINARY_CLOUD_NAME` — CI sets it; copy `.env.example` locally.)

3. Open a PR into `main` (summary, test plan, checklist).
4. Use [Conventional Commits](https://www.conventionalcommits.org/) style subjects.
5. Never commit directly to `main`.

### Guardrails

- Don't add auth pages, dashboards, or anything behind a login — that's `glass-waitlist`'s job. This repo has no backend calls at all.
- Don't hand-diverge a landing component "just for the marketing site" without a reason — it'll get silently clobbered the next time someone ports from `glass-waitlist`, and in the meantime the two sites look inconsistent to visitors bouncing between them.
- Don't loosen `eslint.config.js` here independently of `glass-waitlist` — keep the two in sync so ported components lint the same way in both places.

---

## Documentation

Detailed docs live in [`docs/`](docs/):

- [`docs/architecture.md`](docs/architecture.md) — Architecture overview
- [`docs/cloudinary.md`](docs/cloudinary.md) — Cloudinary asset delivery and the build guard
- [`docs/testing-strategy.md`](docs/testing-strategy.md) — Testing approach
- [`docs/decisions/ADR-001-cloudinary-delivery.md`](docs/decisions/ADR-001-cloudinary-delivery.md) — ADR: Cloudinary delivery

## License

This repository is proprietary to **Glass Limited**. No license to use or
redistribute the software is granted by access to the repository; see
[`LICENSE`](LICENSE).
