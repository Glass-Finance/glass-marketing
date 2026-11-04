/**
 * Member "Problem" section — three stacked story panels.
 *
 * Ported from the design export (Downloads/glasspay-problem-section.html).
 * The active panel plays a short story (the reminder getting buried,
 * app-switching to pay, hunting for proof of payment) while that panel is
 * visible. Scrolling controls which story is active.
 *
 * Styling is Tailwind-only. The long class strings that the design repeats
 * many times (panels, rails, tiles, reels) are declared once as constants
 * below rather than copy-pasted per element, so a change lands in one place.
 *
 * Keyframes live in src/index.css (Tailwind can't declare @keyframes from
 * JSX) and are referenced through the --animate-mps-* theme variables.
 *
 * The active story follows the panel currently in view. App-switch images
 * advance only while that panel remains visible.
 */

import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Clock3, Eye } from "lucide-react";
import { cldSrcSet, cldUrl } from "../../lib/cloudinary";
import ProblemStoryBackdrop from "../ProblemStoryBackdrop";
import { Button } from "../ui/Button";

const STEP = 1700;

/* Screenshot frames are display-capped by their container; these buckets
   cover 1x–2x without over-fetching. */
const FRAME_WIDTHS = [400, 600, 800, 1200];

const HEADLINE = "Paying Dues Shouldn't Be A Hassle";
const LEDE =
  "Without a central place to pay, receipts pile up in chats and members fall behind without realising it.";

/* ── Palette, straight from the design export ────────────────────────────────
   Hardcoded rather than tokenised, matching every other landing component
   in this repo. */
const EASE = "cubic-bezier(0.7,0,0.2,1)";

/* The auto-scrolling stack is revealed only as it scrolls (it sits above the
   frame's clipped top edge, like the design's), so it starts invisible and
   fades in. */
const SCROLL_STACK =
  "absolute inset-x-0 top-0 flex flex-col gap-2 group-[.full]:animate-[var(--animate-mps-scroll)]";

const REMINDER_FATE = ["+12 messages", "+47 messages", "Buried", "Sent ✓"];
const PROOF_DATES = ["Mar 14", "Mar 9", "Feb 27", "Feb 11", "Jan 30", "Jan 8"];

const PANELS = [
  {
    id: "deadlines",
    title: "Do you Struggle To Keep Track Of Payment Deadlines?",
    desc: "Important Reminders Get Lost In Group Chats.",
    kind: "chat",
    icon: Clock3,
  },
  {
    id: "switching",
    title: "Still Switching Apps to Make Payments?",
    desc: "Tired of jumping between platforms just to pay your community dues and contributions?",
    kind: "tiles",
    icon: ArrowLeftRight,
  },
  {
    id: "proof",
    title: "Can't See What You Have Already Paid?",
    desc: "You End Up Scrolling Through Chats For Proof Of Payment.",
    kind: "receipts",
    icon: Eye,
  },
];

/* All three anchor to the top: `cover` crops the bottom of these captures,
   which is where their empty space is. */
const TILES = [
  {
    id: "glass/problem/switch-1-chat",
    alt: "Group chat",
    position: "top",
    caption: "1 · Group chat",
  },
  {
    id: "glass/problem/switch-2-bank",
    alt: "Bank app",
    position: "top",
    caption: "2 · Bank app",
  },
  {
    id: "glass/problem/switch-3-success",
    alt: "Transfer success",
    position: "top",
    caption: "3 · Back to chat",
  },
];

const RECEIPTS = Array.from({ length: 7 }, (_, i) => `glass/problem/receipt-${i + 1}`);

/* ── Repeated class sets ───────────────────────────────────────────────────
   Kept as constants so the design's values appear exactly once. */

const SCENE = [
  "absolute inset-x-6 top-1/2 h-[340px] -translate-y-1/2 transition-[height] duration-800",
  `[transition-timing-function:${EASE}] @container`,
  "max-[1000px]:inset-x-4 max-[1000px]:h-[220px] max-[560px]:h-[280px]",
].join(" ");

const FRAME =
  "relative flex-0 basis-[56%] h-full overflow-hidden rounded-[14px] bg-white border shadow-[0_14px_30px_rgba(15,29,110,0.14)] max-[560px]:h-[140px] max-[560px]:w-full max-[560px]:basis-[140px] max-[560px]:flex-none";

const TILE = [
  "absolute inset-0 mx-auto h-full w-full max-w-[360px] overflow-hidden rounded-[14px] border bg-white",
  "shadow-[0_14px_30px_rgba(15,29,110,0.14)] transition-[opacity,transform] duration-500",
].join(" ");

const TILE_SCENE = "h-[380px]! max-[1000px]:h-[280px]!";

/** Screenshot with responsive delivery. */
function Shot({ id, alt, position, width = 600, className }) {
  return (
    <img
      src={cldUrl(id, { width })}
      srcSet={cldSrcSet(id, FRAME_WIDTHS)}
      sizes="(min-width: 1000px) 560px, 100vw"
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      style={position ? { objectPosition: position } : undefined}
    />
  );
}

/**
 * A vertical slot-machine reel: every line is stacked, and the CSS
 * animation steps the window down one line at a time. When animation is
 * off (reduced motion, or the panel isn't in its story beat) the first
 * line is shown statically instead of a frozen mid-scroll frame.
 */
function Reel({ items, className, animated }) {
  const anim = animated
    ? items.length === 4
      ? "animate-[var(--animate-mps-roll4)]"
      : "animate-[var(--animate-mps-roll6)]"
    : "";

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* Not animating (reduced motion, or the panel is not in its story
          beat): keep only the first line, since the reel would otherwise sit
          frozen part-way through a step. */}
      <span data-loop={anim ? "" : undefined} className={`flex flex-col ${anim}`}>
        {items.map((item, i) => (
          <i
            key={item}
            className={`h-[1.3em] whitespace-nowrap not-italic ${!anim && i > 0 ? "invisible" : ""}`}
          >
            {item}
          </i>
        ))}
      </span>
    </div>
  );
}

export default function MembersProblem() {
  const [active, setActive] = useState(0);
  const [story, setStory] = useState(false);
  const [step, setStep] = useState(0);

  const accRef = useRef(null);
  const activeRef = useRef(0);
  const visibility = useRef([]);

  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const go = (next) => {
    activeRef.current = next;
    setActive(next);
    setStory(true);
    setStep(0);
  };

  /* Start each story only while its panel is in the user's viewport. */
  useEffect(() => {
    const node = accRef.current;
    if (!node) return undefined;
    const panels = [...node.querySelectorAll("article")];
    visibility.current = panels.map(() => 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.current[Number(entry.target.dataset.panelIndex)] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });

        const next = visibility.current.reduce(
          (best, ratio, index) => (ratio > best.ratio ? { index, ratio } : best),
          { index: -1, ratio: 0.3 },
        );

        if (next.index < 0) {
          setStory(false);
          return;
        }

        if (activeRef.current !== next.index) {
          activeRef.current = next.index;
          setStep(0);
        }
        setActive(next.index);
        setStory(true);
      },
      { threshold: [0, 0.2, 0.3, 0.5, 0.75] },
    );
    panels.forEach((panel, index) => {
      panel.dataset.panelIndex = String(index);
      observer.observe(panel);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  /* Play the app-switch sequence only while its panel is visible. */
  useEffect(() => {
    if (reduceMotion || !story || PANELS[active].kind !== "tiles") return undefined;
    const id = setInterval(() => setStep((s) => (s + 1) % TILES.length), STEP);
    return () => clearInterval(id);
  }, [active, story, reduceMotion]);

  const playing = story && !reduceMotion;

  return (
    <section
      className="relative mx-auto max-w-[1240px] overflow-x-clip px-4 pt-[72px] pb-[88px] font-[Inter,sans-serif] text-[17px] leading-[1.55] max-[1000px]:pt-[56px] max-[1000px]:pb-16"
      id="problem"
    >
      <div className="relative text-center">
        <span className="inline-flex items-center rounded-full border border-brand-deep/25 px-5 py-2 text-[13px] font-medium text-brand-deep">
          The Problem
        </span>
        <h2 className="mt-[26px] text-[clamp(26px,5vw,58px)] font-bold leading-[1.15] tracking-[-0.02em] text-balance text-brand-ink">
          {HEADLINE}
        </h2>
        <p className="mx-auto mt-[18px] max-w-[56ch] text-[clamp(15px,2vw,17px)] leading-[1.7] text-black/60">
          {LEDE}
        </p>
      </div>

      <div
        className="relative mt-16 flex flex-col gap-12 max-[1000px]:mt-11 max-[560px]:gap-9"
        ref={accRef}
      >
        {PANELS.map((panel, i) => {
          const on = i === active;
          const full = on && story;
          const Icon = panel.icon;

          return (
            <article
              key={panel.id}
              className={`group relative ${on ? "on" : ""} ${full ? "full" : ""}`}
            >
              <Button
                type="button"
                aria-pressed={on}
                variant="tertiary"
                size="md"
                fullWidth={false}
                onClick={() => go(i)}
                className="!mb-5 !h-auto !p-0 flex w-full items-center justify-start gap-4 rounded-none border-0 bg-transparent text-left hover:bg-transparent active:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#002fa7]"
              >
                <span className="grid size-12 flex-none place-items-center rounded-full border border-[#ecedf3] bg-white/70 text-[#002fa7] md:size-16">
                  <Icon aria-hidden="true" size={24} strokeWidth={1.7} />
                </span>
                <span className="max-w-[68ch]">
                  <span className="block text-[clamp(16px,2vw,24px)] font-semibold leading-[1.35] text-[#001f6e]">
                    {panel.title}
                  </span>
                  <span className="mt-1 block text-[clamp(12px,1.5vw,18px)] leading-[1.5] text-[#808080]">
                    {panel.desc}
                  </span>
                </span>
              </Button>

              <div
                className={`relative isolate aspect-[1215/587] min-h-[280px] w-full overflow-hidden rounded-[8px] border border-black/10 max-[1000px]:min-h-[240px] max-[560px]:min-h-[300px] lg:min-h-[460px] ${panel.kind === "tiles" ? "max-[1000px]:min-h-[300px] max-[560px]:min-h-[300px]" : ""}`}
              >
                <ProblemStoryBackdrop className="absolute inset-0" />
                <div className="relative z-10 h-full w-full">
                  <div className={`${SCENE} ${panel.kind === "tiles" ? TILE_SCENE : ""}`}>
                    {panel.kind === "chat" && (
                      <div className="flex h-full gap-5 max-[560px]:flex-col max-[560px]:gap-2">
                        <div className={FRAME}>
                          <div data-loop className={SCROLL_STACK}>
                            <div className="mx-3 mt-2.5 rounded-[10px] bg-[#002fa7] px-3.5 py-2.5 text-[14px] font-semibold leading-[1.35] text-white">
                              <small className="mb-0.5 block font-[JetBrains_Mono] text-[10px] font-semibold tracking-[0.1em] uppercase opacity-75">
                                Treasurer · 9:02
                              </small>
                              Dues of ₦25,000 are due Friday
                            </div>
                            <Shot id="glass/problem/chat-group" alt="Busy group chat" width={600} />
                          </div>
                        </div>
                        <div
                          className={`min-w-0 flex-1 pt-1.5 max-[560px]:flex-none max-[560px]:w-full max-[560px]:pt-0 ${on ? "animate-[var(--animate-mps-enter)] [animation-delay:1s]" : ""}`}
                        >
                          <div className="flex min-h-[112px] items-center rounded-sm bg-white/90 px-6 py-5 shadow-[0_2px_12px_rgba(15,29,110,0.08)] md:min-h-[140px] md:px-8">
                            <Reel
                              items={REMINDER_FATE}
                              className="h-[clamp(28px,3.8vw,40px)] text-[clamp(20px,3vw,32px)] font-semibold leading-[clamp(28px,3.8vw,40px)] text-black"
                              animated={on && playing}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {panel.kind === "tiles" && (
                      <div className="relative h-full w-full">
                        <div
                          className={`relative flex h-full w-full items-center justify-center ${on ? "animate-[var(--animate-mps-enter)] [animation-delay:500ms]" : ""}`}
                        >
                          <span
                            className={`absolute top-2.5 right-2.5 z-2 rounded-full bg-[#002fa7] px-3 py-1.5 font-[JetBrains_Mono] text-[12px] font-semibold text-white transition-opacity duration-400 max-[1000px]:top-1.5 max-[1000px]:right-1.5 max-[1000px]:px-2 max-[1000px]:py-0.5 max-[1000px]:text-[10px] ${on ? "opacity-100" : "opacity-0"}`}
                          >
                            App switch {(step % TILES.length) + 1} / 3
                          </span>
                          {TILES.map((tile, t) => {
                            const tileActive =
                              on && (reduceMotion ? t === 0 : playing && t === step % TILES.length);
                            return (
                              <div
                                key={tile.id}
                                aria-hidden={!tileActive}
                                className={`${TILE} ${tileActive ? "z-1 translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-2 scale-[0.97] opacity-0"}`}
                              >
                                <Shot
                                  id={tile.id}
                                  alt={tile.alt}
                                  position={tile.position}
                                  width={400}
                                  className="h-full w-full object-contain"
                                />
                                <span className="absolute inset-x-0 bottom-0 overflow-hidden bg-[linear-gradient(transparent,#0c1020d0)] px-3 pt-[26px] pb-2.5 text-[13px] font-semibold whitespace-nowrap text-white max-[1000px]:px-2 max-[1000px]:text-[11px]">
                                  {tile.caption}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {panel.kind === "receipts" && (
                      <div className="flex h-full gap-5 max-[560px]:flex-col max-[560px]:gap-2">
                        <div className={FRAME}>
                          <div data-loop className={`${SCROLL_STACK} [animation-duration:12s]`}>
                            {RECEIPTS.map((id) => (
                              <Shot key={id} id={id} alt="Payment receipt" width={600} />
                            ))}
                          </div>
                        </div>
                        <div
                          className={`min-w-0 flex-1 pt-1.5 max-[560px]:flex-none max-[560px]:w-full max-[560px]:pt-0 ${on ? "animate-[var(--animate-mps-enter)] [animation-delay:1s]" : ""}`}
                        >
                          <div className="flex min-h-[112px] flex-col justify-center rounded-sm bg-white/90 px-6 py-5 shadow-[0_2px_12px_rgba(15,29,110,0.08)] md:min-h-[140px] md:px-8">
                            <small className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                              Searching: March proof
                            </small>
                            <Reel
                              items={PROOF_DATES}
                              className="h-[2.6em] text-[clamp(16px,2vw,24px)] font-bold leading-[1.3] text-black"
                              animated={on && playing}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <i
                    data-loop
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,#002FA7,#002fa7,#6b2fb5)] group-[.on]:animate-[var(--animate-mps-progress)]"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
