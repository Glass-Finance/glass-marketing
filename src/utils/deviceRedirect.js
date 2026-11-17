// ─────────────────────────────────────────────────────────────────────────────
// Device detection for the member app's mobile-only gating.
//
// Tablets are treated as desktop — the member experience is phone-first,
// not just "narrow viewport," so a tablet shouldn't slip through a pure
// width check. User-agent sniffing is the primary signal; viewport width is
// a fallback for the rare case the UA can't be read.
// ─────────────────────────────────────────────────────────────────────────────

function getDeviceType() {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";

  if (ua) {
    const isTablet = /iPad|Tablet|(Android(?!.*Mobile))/i.test(ua);
    if (isTablet) return "tablet";
    const isMobile = /Mobi|iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry/i.test(ua);
    if (isMobile) return "mobile";
  }

  // UA didn't confirm mobile — either it's missing, or it's a desktop UA
  // that a viewport-only device simulator left untouched (many don't spoof
  // the UA string, they just resize the viewport and switch to touch
  // emulation). A narrow AND touch-primary viewport is treated as mobile
  // too. Pointer type is the important part, not just width: a real
  // desktop user browsing with a mouse in a narrowed window still reports
  // a "fine" pointer, so this doesn't false-positive on them the way a
  // pure width check would.
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches;
    if (!ua || coarsePointer) return "mobile";
  }
  return "desktop";
}

export function isMobileDevice() {
  return getDeviceType() === "mobile";
}

// This site is the marketing-only deployment (glasspay.app); the actual
// product lives on a separate deployment (app.glasspay.app) — a genuinely
// different codebase/repo, not just a different route. Unlike the main
// app's copy of this file (where APP_ORIGIN falls back to the current
// origin for local single-deployment dev), the fallback here is pinned to
// the real app domain so cross-origin navigation still works correctly
// even if VITE_APP_URL isn't set on this deployment.
export const APP_ORIGIN = import.meta.env.VITE_APP_URL ?? "https://app.glasspay.app";

// ── Marketing / app domain separation ────────────────────────────────────────
// glasspay.app + www serve the marketing site only; the application lives on
// APP_ORIGIN (app.glasspay.app in production).
const MARKETING_HOSTS = new Set(["glasspay.app", "www.glasspay.app", "staging.glasspay.app"]);

function isAppOriginSeparate() {
  try {
    return new URL(APP_ORIGIN).origin !== window.location.origin;
  } catch {
    return false;
  }
}

export function isMarketingHost() {
  return MARKETING_HOSTS.has(window.location.hostname) && isAppOriginSeparate();
}

// Navigate to an app path: a hard hop to APP_ORIGIN from the marketing
// domain, ordinary SPA navigation everywhere else (e.g. local dev where
// this site isn't running on a recognized marketing hostname).
export function goToApp(path, navigate) {
  if (isMarketingHost()) {
    window.location.href = `${APP_ORIGIN}${path}`;
    return;
  }
  navigate(path);
}

// Builds the absolute URL for a path so it can be used as a plain <a href>
// or shared directly (e.g. an invite link).
export function buildMobileUrl(path) {
  return `${APP_ORIGIN}${path}`;
}

// Where to send the "mobile-required" screen so it can render a QR back to
// wherever the user was actually trying to go.
export function mobileRequiredPath(targetPath) {
  return `/member/mobile-required?to=${encodeURIComponent(targetPath)}`;
}
