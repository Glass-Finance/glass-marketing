import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig, globalIgnores } from "eslint/config";

// ── Debt list: files still using a raw <button> ─────────────────────────────
//
// The rule in the `ui/Button` block below is an ERROR everywhere else, so
// this list is a ratchet: a NEW file that reaches for a raw <button> fails
// lint, and a file leaves this list when it is migrated to ui/Button.
//
// AGENTS.md already asks for a reason for a raw <button>. A few of these have
// one — see the notes below. The rest are simply not migrated yet.
//
// The seven shared files mirror the app repo's list, which carries the same
// entries for the same reasons; keep the two in step so a ported file lints
// identically in both places. The four marketing-only files are this repo's
// own, and none of them can use ui/Button at all:
//
//   Security.jsx — a full-width step disclosure (aria-current="step"), not
//     one of the design system's button roles. ui/Button would impose a 4px
//     radius and a role fill on a text row.
//   dashboard-overlay/{DashboardScreen,MembersScreen,PaymentsScreen}.jsx —
//     decorative replicas of the app's screens inside the landing mockup.
//     They carry tabIndex={-1} and aria-hidden="true" and must NOT be
//     reachable by keyboard or carry real button chrome; ui/Button renders
//     exactly that.
//
// Keeping the debt in ONE list, rather than a dozen inline disables spread
// over the tree, means the remaining work is visible in one place and
// shrinks over time instead of being invisible until the rule is switched on.
const RAW_BUTTON_DEBT = [
  "src/components/ErrorBoundary.jsx",
  "src/components/Navbar.jsx",
  "src/components/Security.jsx",
  "src/components/UseCases.jsx",
  "src/components/WhyGlass.jsx",
  "src/components/organizations/ProblemSection.jsx",
  "src/components/organizations/dashboard-overlay/DashboardScreen.jsx",
  "src/components/organizations/dashboard-overlay/MembersScreen.jsx",
  "src/components/organizations/dashboard-overlay/PaymentsScreen.jsx",
  "src/components/ui/Button.jsx",
  "src/components/ui/LandingCta.jsx",
];

export default defineConfig([
  globalIgnores(["dist", "coverage", "playwright-report", "test-results"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      // Base no-unused-vars doesn't see `<motion.div>`-style JSX member
      // expressions as a use of `motion` -- without this, every import used
      // only that way (motion throughout this site) false-positives as unused.
      "react/jsx-uses-vars": "error",
      // Accessibility -- jsx-a11y recommended, with the same five rules the
      // app repo turns off for its pre-existing backlog. They are NOT
      // re-enabled here because the markup they flag is IDENTICAL in both
      // repos -- this is shared, already-shipped debt, not new v1 debt:
      //
      //   no-noninteractive-element-interactions / click-events-have-key-events
      //     members/MembersProblem.jsx:412 -- <article onClick> with no
      //     keyboard path. Byte-identical in the app repo, which lints clean
      //     only because these two rules are off there too.
      //   no-static-element-interactions
      //     common/CloudImage.jsx:52 and ui/VariableProximity.jsx:148 --
      //     <span onClick>. Optional passthrough props; fixing it properly
      //     means giving the wrapper a real role + key handler, which is a
      //     component-API change, not a lint fix.
      //
      // Everything else in recommended stays error-level. Re-enable these as
      // the debt is paid down, and fix in the app repo FIRST so the two
      // stay in sync -- see docs/testing-strategy.md there.
      // NOTE: the jsx-a11y recommended spread must come BEFORE the "off"
      // overrides below. Object spread preserves insertion order, so putting
      // it last silently re-enables every rule the overrides just turned off
      // -- the config then looks right and lints wrong.
      ...jsxA11y.configs.recommended.rules,
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      // react-refresh only-export-components: flat config REPLACES inherited
      // rule options rather than merging them, so the option supplied by
      // reactRefresh.configs.vite (in extends[]) must be restated explicitly
      // or allowConstantExport silently reverts to its strict default.
      //
      // Option names differ by plugin major: this repo is on react-refresh
      // 0.4.x, which accepts allowExportNames / customHOCs. The app repo is
      // on 0.5.x, which renamed them to allowCompoundComponents / extraHOCs.
      // Copying the app's config verbatim fails schema validation here with
      // "should NOT have additional properties" -- keep the two in sync by
      // intent, not by byte-copy, until this repo's plugin is bumped to 0.5.x.
      "react-refresh/only-export-components": ["error", { allowConstantExport: true }],
    },
  },
  {
    // The design-system button rule, enforced everywhere except the files
    // still carrying the debt (RAW_BUTTON_DEBT above).
    //
    // `ui/Button` owns the button roles, sizes and focus treatment, and the
    // design system is the source of truth for all of it. A raw <button>
    // opts out of every one of those rules, so the convention needs to be a
    // gate rather than a sentence in AGENTS.md.
    files: ["src/**/*.{js,jsx}"],
    // RAW_BUTTON_DEBT is the production debt list. Test files are excluded
    // outright: a test that renders a raw <button> is asserting on markup,
    // not shipping UI, and `ui/Button` is not what is under test there.
    //
    // This repo colocates its tests with the source (`*.test.jsx` next to the
    // module), where the app repo keeps them under `src/__tests__/` -- so the
    // exclusion pattern differs from the app's, and must.
    ignores: [...RAW_BUTTON_DEBT, "**/*.test.{js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          // JSXOpeningElement, not JSXElement: a JSXElement node has no `name`
          // property (it has openingElement/children/closingElement), so the
          // selector "JSXElement[name.name='button']" matches NOTHING and the
          // rule is silently inert. The `name` property lives on the opening
          // element, whose name is a JSXIdentifier carrying the string.
          // Verified by running the rule against a probe file.
          selector: "JSXOpeningElement[name.name='button']",
          message:
            "Use ui/Button (src/components/ui/Button.jsx) instead of a raw <button>. If a raw button is genuinely required, add the file to RAW_BUTTON_DEBT in eslint.config.js with a reason.",
        },
      ],
    },
  },
  {
    // Components never call the API directly — server state reaches them
    // through the React Query hooks in src/hooks/ (see docs/data-fetching.md).
    //
    // Pages are deliberately NOT covered: a page owns a mutation and calling
    // src/api/ for one is the intended shape.
    //
    // This site has no src/api/ directory today — it is a static marketing
    // deployment with no backend client. The rule is kept anyway so that if
    // an API layer is ever added here, the boundary holds from the first
    // file rather than after the first violation.
    files: ["src/components/**/*.{js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/api/*", "**/api/**"],
              message:
                "Components must not call src/api/ directly. Expose the server state through a React Query hook in src/hooks/ — see docs/data-fetching.md.",
            },
          ],
        },
      ],
    },
  },
  {
    // Node-side tooling config (runs under Node, not the browser).
    files: ["eslint.config.js", "postcss.config.js", "vite.config.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]);
