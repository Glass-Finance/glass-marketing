import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
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
    // Node-side tooling config (runs under Node, not the browser).
    files: ["eslint.config.js", "postcss.config.js", "vite.config.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]);
