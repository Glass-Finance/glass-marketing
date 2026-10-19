import * as Sentry from "@sentry/react";

// Same fallback pattern as GOOGLE_CLIENT_ID in main.jsx -- if the DSN isn't
// configured (local dev, or before ops sets one up), the app runs exactly
// as it does today with monitoring silently disabled, rather than crashing
// on a missing env var or reporting noise from every developer's laptop.
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? "";

let enabled = false;

// 0..1 sampling of performance transactions once a DSN exists. Set
// VITE_SENTRY_TRACES_SAMPLE_RATE to opt in; unset/invalid means 0, i.e. this
// site stays crash/error-only unless someone deliberately turns tracing on.
//
// This deliberately DIFFERS from glass-waitlist, which defaults to 0.1. That
// repo made a call to collect performance traces on the member app; this one
// has documented otherwise ("scoped to crash/error visibility only"), and
// silently starting to ship 10% of transactions from the marketing site is a
// quota/privacy decision, not a config sync. Align them deliberately.
function resolveTracesSampleRate() {
  const raw = import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE;
  if (raw === undefined || raw === null || raw === "") return 0;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > 1) return 0;
  return n;
}

export function initMonitoring() {
  if (!SENTRY_DSN) return;
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: resolveTracesSampleRate(),
    // Reproduce the restrictive v10-era defaults explicitly, so upgrading the
    // SDK later cannot silently widen what error reports carry (cookies,
    // user info, request/response headers, HTTP bodies).
    //
    // Ported from glass-waitlist's identical block. That block also lists
    // `urlQueryParams`, `databaseQueryData` and `graphQL`; those three keys
    // are NOT present in @sentry/core 10.x's resolved options and are silently
    // DROPPED on init (verified by resolving client._dataCollection on
    // 10.65.0 -- five of eight keys survive, these three do not). They work on
    // the app repo's @sentry/core 11.2.0. They are omitted here rather than
    // written in and believed: a config that lists a control it does not
    // apply is worse than one that admits the gap.
    //
    // The gap that actually matters on this site is `urlQueryParams` -- this
    // is the only PII-bearing control of the three, and the other two
    // (database/GraphQL payload capture) have no consumer on a static
    // marketing site regardless. To close it, bump @sentry/react to ^11.2.0
    // (its own PR, per AGENTS.md dependency policy) and re-add the three keys.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: {
        request: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
        response: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
      },
      httpBodies: [],
      genAI: { inputs: false, outputs: false },
    },
  });
  enabled = true;
}

// True when a DSN was present at boot -- lets a smoke test assert the site
// isn't accidentally running blind in production.
export function isMonitoringEnabled() {
  return enabled;
}

// A routine 4xx (validation error, wrong password, "Active Default Account
// Required", etc.) is expected user-facing feedback, not a bug -- reporting
// every one of those would drown out the signal. Only report network
// failures (no response at all) and 5xx server errors, which are the cases
// where something actually broke.
function isWorthReporting(error) {
  const status = error?.response?.status;
  if (status === undefined) return true; // network error / no response
  return status >= 500;
}

// The single choke point every error in the app already flows through
// (mutationCache.onError -> notifyError, plus ad-hoc notifyError calls) --
// wiring in here gives crash visibility across the whole app without
// touching every call site individually.
export function captureException(error, { context } = {}) {
  if (!enabled || !isWorthReporting(error)) return;
  Sentry.captureException(error, {
    tags: context ? { context } : undefined,
  });
}

// For render-time crashes caught by ErrorBoundary, which have a React
// componentStack instead of an HTTP response to filter on -- always worth
// reporting, since these are unconditionally real bugs.
export function captureRenderError(error, componentStack) {
  if (!enabled) return;
  Sentry.captureException(error, {
    contexts: { react: { componentStack } },
  });
}
