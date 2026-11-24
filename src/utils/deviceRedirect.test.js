import { describe, it, expect, vi, afterEach } from "vitest";
import {
  isMobileDevice,
  isMarketingHost,
  goToApp,
  buildMobileUrl,
  mobileRequiredPath,
} from "./deviceRedirect";

function setUserAgent(ua) {
  Object.defineProperty(navigator, "userAgent", { value: ua, configurable: true });
}

function setViewport({ width, coarsePointer = false } = {}) {
  if (width !== undefined) {
    Object.defineProperty(window, "innerWidth", { value: width, configurable: true });
  }
  window.matchMedia = vi.fn().mockReturnValue({ matches: coarsePointer });
}

const ORIGINAL_UA = navigator.userAgent;

afterEach(() => {
  setUserAgent(ORIGINAL_UA);
  vi.unstubAllEnvs();
});

describe("isMobileDevice", () => {
  it("detects a real iPhone UA as mobile", () => {
    setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15");
    expect(isMobileDevice()).toBe(true);
  });

  it("detects a real Android mobile UA as mobile", () => {
    setUserAgent("Mozilla/5.0 (Linux; Android 13; Pixel 7) Mobile Safari/537.36");
    expect(isMobileDevice()).toBe(true);
  });

  it("treats an iPad UA as tablet, not mobile", () => {
    setUserAgent("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15");
    expect(isMobileDevice()).toBe(false);
  });

  it("treats a plain Android tablet UA (no 'Mobile' token) as tablet, not mobile", () => {
    setUserAgent("Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36");
    expect(isMobileDevice()).toBe(false);
  });

  it("treats a desktop UA as desktop even at a narrow viewport with a fine pointer", () => {
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0");
    setViewport({ width: 400, coarsePointer: false });
    expect(isMobileDevice()).toBe(false);
  });

  it("falls back to mobile for any narrow viewport when the UA is empty, regardless of pointer type", () => {
    setUserAgent("");
    setViewport({ width: 400, coarsePointer: false });
    expect(isMobileDevice()).toBe(true);
    setViewport({ width: 400, coarsePointer: true });
    expect(isMobileDevice()).toBe(true);
  });

  it("treats a desktop UA at a narrow, touch-primary viewport as mobile (viewport-only device simulator)", () => {
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0");
    setViewport({ width: 400, coarsePointer: true });
    expect(isMobileDevice()).toBe(true);
  });
});

describe("buildMobileUrl", () => {
  it("prefixes the path with APP_ORIGIN", () => {
    expect(buildMobileUrl("/member/join")).toMatch(/^https?:\/\/.+\/member\/join$/);
  });
});

describe("mobileRequiredPath", () => {
  it("builds the mobile-required path with the target URL-encoded", () => {
    expect(mobileRequiredPath("/member/join?community=abc")).toBe(
      "/member/mobile-required?to=%2Fmember%2Fjoin%3Fcommunity%3Dabc",
    );
  });
});

describe("isMarketingHost / goToApp", () => {
  const originalLocation = window.location;

  function setHostname(hostname) {
    Object.defineProperty(window, "location", {
      value: { ...originalLocation, hostname, origin: `https://${hostname}` },
      configurable: true,
      writable: true,
    });
  }

  afterEach(() => {
    Object.defineProperty(window, "location", {
      value: originalLocation,
      configurable: true,
      writable: true,
    });
  });

  it("is not a marketing host on localhost (dev)", () => {
    setHostname("localhost");
    expect(isMarketingHost()).toBe(false);
  });

  it("is a marketing host on glasspay.app", () => {
    setHostname("glasspay.app");
    expect(isMarketingHost()).toBe(true);
  });

  it("is a marketing host on www.glasspay.app", () => {
    setHostname("www.glasspay.app");
    expect(isMarketingHost()).toBe(true);
  });

  it("recognizes the staging marketing host", () => {
    setHostname("staging.glasspay.app");
    expect(isMarketingHost()).toBe(true);
  });

  it("sends staging marketing visitors to the configured staging app", async () => {
    setHostname("staging.glasspay.app");
    vi.stubEnv("VITE_APP_URL", "https://staging-app.glasspay.app");
    vi.resetModules();
    try {
      const staging = await import("./deviceRedirect");
      const navigate = vi.fn();
      staging.goToApp("/sign-up", navigate);
      expect(navigate).not.toHaveBeenCalled();
      expect(window.location.href).toBe("https://staging-app.glasspay.app/sign-up");
      expect(staging.buildMobileUrl("/member/join")).toBe(
        "https://staging-app.glasspay.app/member/join",
      );
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });

  it("goToApp hard-navigates when on the marketing host", () => {
    setHostname("glasspay.app");
    const navigate = vi.fn();
    delete window.location.href;
    window.location.href = "";
    goToApp("/sign-up", navigate);
    expect(navigate).not.toHaveBeenCalled();
    expect(window.location.href).toMatch(/\/sign-up$/);
  });

  it("goToApp uses ordinary SPA navigation off the marketing host", () => {
    setHostname("localhost");
    const navigate = vi.fn();
    goToApp("/sign-up", navigate);
    expect(navigate).toHaveBeenCalledWith("/sign-up");
  });
});
