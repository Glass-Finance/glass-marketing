import { useEffect, useRef } from "react";
import { Crisp } from "crisp-sdk-web";

// Marketing-site support chat. Uses the same Website ID as the app, and
// Crisp's default cookie domain is the shared base domain, so a visitor
// keeps their conversation when moving between glasspay.app and
// app.glasspay.app. With Total Privacy Mode enabled in the Crisp
// dashboard, no chatbox cookies are set until the visitor opens the chat.
//
// Deliberately top-level (not src/components/common/): the app repo keeps
// its auth-aware copy at src/components/common/CrispChat.jsx, and files
// under common/ must stay byte-identical across both repos.
//
// The Crisp dashboard carries a Glass logo as the website avatar. Crisp
// re-injects it into the widget on every repaint (chat open/close toggles
// the launcher), so CSS alone always reverts — the observer below strips
// the avatar from the DOM wherever it appears, making the custom launcher
// glyph the only icon that ever renders. Scoped to #crisp-chatbox: the
// logo must go from the widget entirely, nothing outside it is touched.
const WEBSITE_AVATAR_MARK = "/avatar/website/";

function isWebsiteAvatarUrl(url) {
  return typeof url === "string" && url.includes(WEBSITE_AVATAR_MARK);
}

function stripWebsiteAvatar(node) {
  if (!(node instanceof Element)) return;
  const box = node.closest("#crisp-chatbox") ?? node.querySelector("#crisp-chatbox");
  if (!box) return; // mutation outside the widget
  for (const el of box.querySelectorAll("*")) {
    if (isWebsiteAvatarUrl(el.style.backgroundImage)) {
      el.style.removeProperty("background-image");
    }
    if (el.tagName === "IMG" && isWebsiteAvatarUrl(el.getAttribute("src"))) {
      el.removeAttribute("src");
      el.style.setProperty("display", "none", "important");
    }
    // Chat-window avatars are inline SVGs: the Glass logo sits in an
    // <image> layer above the default Crisp avatar. Drop the href so the
    // default shows through — the logo must never render anywhere.
    if (
      el.tagName === "image" &&
      (isWebsiteAvatarUrl(el.getAttribute("xlink:href")) ||
        isWebsiteAvatarUrl(el.getAttribute("href")))
    ) {
      el.removeAttribute("xlink:href");
      el.removeAttribute("href");
    }
  }
}

export default function CrispChat() {
  const configured = useRef(false);
  const websiteId = import.meta.env.VITE_CRISP_WEBSITE_ID;

  useEffect(() => {
    if (!websiteId || configured.current) return;
    Crisp.configure(websiteId, { sessionMerge: true });
    configured.current = true;
  }, [websiteId]);

  useEffect(() => {
    if (!websiteId) return;
    // Permanently remove the Glass logo from the widget: watch the whole
    // document (Crisp injects #crisp-chatbox asynchronously) but only act
    // on mutations inside it. Re-stripping a stripped node is a no-op, so
    // Crisp re-applying the avatar cannot loop the observer.
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          stripWebsiteAvatar(mutation.target);
        } else {
          for (const node of mutation.addedNodes) stripWebsiteAvatar(node);
        }
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "src", "href", "xlink:href"],
    });
    return () => observer.disconnect();
  }, [websiteId]);

  return null;
}
