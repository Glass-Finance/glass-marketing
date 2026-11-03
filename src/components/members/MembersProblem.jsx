/**
 * Member "Problem" section — three stacked story panels.
 *
 * Ported from the design export (Downloads/glasspay-problem-section.html).
 * The active panel plays a short story (the reminder getting buried,
 * app-switching to pay, hunting for proof of payment) before the carousel
 * moves on.
 *
 * Styling is Tailwind-only. The long class strings that the design repeats
 * many times (panels, rails, tiles, reels) are declared once as constants
 * below rather than copy-pasted per element, so a change lands in one place.
 *
 * Keyframes live in src/index.css (Tailwind can't declare @keyframes from
 * JSX) and are referenced through the --animate-mps-* theme variables.
 *
 * Timer constants mirror the design:
 *   DWELL   8000ms  how long a panel stays active
 *   STORY   2800ms  delay before the story starts
 *   STEP    1700ms  app-switch tile step
 *   RESUME  3500ms  delay before resuming after pointer-leave
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Clock3, Eye } from "lucide-react";
import { cldSrcSet, cldUrl } from "../../lib/cloudinary";
import ProblemStoryBackdrop from "../ProblemStoryBackdrop";
import { Button } from "../ui/Button";

const DWELL = 8000;
const STORY = 2800;
const STEP = 1700;
const RESUME = 3500;

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

const REMINDER_FATE = ["Sent ✓", "+12 messages", "+47 messages", "Buried"];
const PROOF_DATES = ["Mar 14", "Mar 9", "Feb 27", "Feb 11", "Jan 30", "Jan 8"];

const PANELS = [
  {
    id: "deadlines",
    title: "Missing Payment Deadlines?",
    desc: "Important reminders get lost in group chats.",
    kind: "chat",
    icon: Clock3,
  },
  {
    id: "switching",
    title: "Still Switching Between Apps To Pay?",
    desc: "Copying account numbers and switching apps turns a simple payment into a chore.",
    kind: "tiles",
    icon: ArrowLeftRight,
  },
  {
    id: "proof",
    title: "Can't See What You've Already Paid?",
    desc: "You end up scrolling through chats for proof of payment.",
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
  "max-[1000px]:inset-x-4 max-[1000px]:h-[220px]",
].join(" ");

const FRAME =
  "relative flex-0 basis-[56%] h-full overflow-hidden rounded-[14px] bg-white border shadow-[0_14px_30px_rgba(15,29,110,0.14)]";

const TILE = [
  "relative flex-1 min-w-0 h-full overflow-hidden rounded-[14px] bg-white border",
  "shadow-[0_14px_30px_rgba(15,29,110,0.14)] transition-[flex-grow,opacity,box-shadow]",
  "duration-500 group-[.full]:opacity-50",
].join(" ");

/* On phones the three tiles are too narrow to read, so the row becomes a
   one-up carousel: only the active tile is rendered, full width. */
/* The active tile used to grow 2.4x, which left it more than twice as wide
   as the others. `cover` then matched on width and cropped the sides, so it
   showed only ~40% of its screenshot while the narrow ones showed all of
   it. A gentler 1.4x keeps the focus cue but keeps the widths close enough
   that every tile shows most of the screen. On phones the tile is pinned
   to roughly the screenshot's own aspect so the full capture fits. */
const TILE_ACTIVE = [
  "group-[.full]:opacity-100 [flex-grow:1.4]",
  "shadow-[0_0_0_3px_#002FA7,0_18px_36px_rgba(0,47,167,0.3)]",
  "max-[1000px]:flex-[1_1_auto]",
  "max-[1000px]:mx-auto",
  "max-[1000px]:w-full",
  "max-[1000px]:max-w-[178px]",
].join(" ");

const TILE_SCENE = "h-[340px]! max-[1000px]:h-[220px]!";

const MONO_KICKER =
  "block font-[JetBrains_Mono] text-[clamp(8px,0.9vw,12px)] font-semibold tracking-[0.08em] uppercase text-[#002fa7]";

const REEL_TEXT = "text-[clamp(12px,2.4vw,30px)] font-bold leading-[1.3] tracking-[-0.03em]";

/** Screenshot with responsive delivery. */
function Shot({ id, alt, position, width = 600 }) {
  return (
    <img
      src={cldUrl(id, { width })}
      srcSet={cldSrcSet(id, FRAME_WIDTHS)}
      sizes="(min-width: 1000px) 560px, 100vw"
      alt={alt}
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
          <i key={item} className={`not-italic h-[1.3em] ${!anim && i > 0 ? "invisible" : ""}`}>
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
  const timers = useRef([]);

  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const go = useCallback(
    (next) => {
      clearTimers();
      setActive(next);
      setStory(false);
      setStep(0);
      later(() => setStory(true), reduceMotion ? 0 : STORY);
      later(() => setActive((cur) => (cur + 1) % PANELS.length), reduceMotion ? 0 : DWELL);
    },
    [clearTimers, later, reduceMotion],
  );

  /* Carousel: only advance while the section is on screen, and hand control
     to the pointer on hover (the .hold class freezes the CSS motion). */
  useEffect(() => {
    const node = accRef.current;
    if (!node || reduceMotion) return undefined;

    let visible = false;
    const start = () => {
      clearTimers();
      if (!story) later(() => setStory(true), STORY);
      later(() => setActive((cur) => (cur + 1) % PANELS.length), DWELL);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) start();
        else clearTimers();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);

    const hold = () => {
      clearTimers();
      node.dataset.hold = "true";
    };
    const release = () => {
      delete node.dataset.hold;
      if (visible) later(() => setActive((cur) => (cur + 1) % PANELS.length), RESUME);
    };
    node.addEventListener("pointerenter", hold);
    node.addEventListener("pointerleave", release);

    return () => {
      observer.disconnect();
      node.removeEventListener("pointerenter", hold);
      node.removeEventListener("pointerleave", release);
      clearTimers();
    };
  }, [clearTimers, later, reduceMotion, story]);

  /* App-switch tiles advance on their own while panel 2 tells its story. */
  useEffect(() => {
    if (reduceMotion || !story || PANELS[active].kind !== "tiles") return undefined;
    const id = setInterval(() => setStep((s) => (s + 1) % TILES.length), STEP);
    return () => clearInterval(id);
  }, [active, story, reduceMotion]);

  useEffect(() => clearTimers, [clearTimers]);

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
        <h2 className="mx-auto mt-[26px] text-[clamp(26px,5vw,58px)] font-bold leading-[1.15] tracking-[-0.02em] text-balance text-brand-ink">
          {HEADLINE}
        </h2>
        <p className="mx-auto mt-[18px] max-w-[56ch] text-[clamp(15px,2vw,17px)] leading-[1.7] text-black/60">
          {LEDE}
        </p>
      </div>

      <div className="relative mt-16 flex flex-col gap-12 max-[1000px]:mt-11 max-[560px]:gap-9" ref={accRef}>
        {PANELS.map((panel, i) => {
          const on = i === active;
          const full = on && story;
          const Icon = panel.icon;

          return (
            <article key={panel.id} className={`group relative ${on ? "on" : ""} ${full ? "full" : ""}`}>
              <Button
                type="button"
                aria-pressed={on}
                variant="tertiary"
                size="md"
                fullWidth={false}
                onClick={() => go(i)}
                className="!mb-5 !h-auto !p-0 flex w-full items-center justify-center gap-4 rounded-none border-0 bg-transparent text-left hover:bg-transparent active:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#002fa7] max-[560px]:justify-start"
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

              <div className="relative isolate aspect-[1215/587] min-h-[280px] w-full overflow-hidden rounded-[8px] border border-black/10 max-[1000px]:min-h-[240px] max-[560px]:min-h-[220px]">
                <ProblemStoryBackdrop className="absolute inset-0" />
                <div className="relative z-10 h-full w-full">
                  <div className={`${SCENE} ${panel.kind === "tiles" ? TILE_SCENE : ""}`}>
                    {panel.kind === "chat" && (
                      <div className="flex h-full gap-5">
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
                          className={`min-w-0 flex-1 pt-1.5 ${on ? "animate-[var(--animate-mps-enter)] [animation-delay:1s]" : ""}`}
                        >
                          <small className={MONO_KICKER}>Your reminder</small>
                          <Reel
                            items={REMINDER_FATE}
                            className={`mt-2 h-[1.3em] ${REEL_TEXT}`}
                            animated={on && playing}
                          />
                          <small className={`mt-4 block ${MONO_KICKER} text-[#ef4444]`}>
                            Result: payment overdue
                          </small>
                        </div>
                      </div>
                    )}

                    {panel.kind === "tiles" && (
                      <div className="h-full">
                        <div
                          className={`relative flex h-full w-full gap-3 ${on ? "animate-[var(--animate-mps-enter)] [animation-delay:500ms]" : ""}`}
                        >
                          <span
                            className={`absolute top-2.5 right-2.5 z-2 rounded-full bg-[#002fa7] px-3 py-1.5 font-[JetBrains_Mono] text-[12px] font-semibold text-white transition-opacity duration-400 group-[.full]:opacity-100 max-[1000px]:top-1.5 max-[1000px]:right-1.5 max-[1000px]:px-2 max-[1000px]:py-0.5 max-[1000px]:text-[10px] ${on ? "opacity-100" : "opacity-0"}`}
                            >
                            App switch {(step % TILES.length) + 1} / 3
                          </span>
                          {TILES.map((tile, t) => {
                            const tileActive =
                              on && (reduceMotion ? t === 0 : playing && t === step % TILES.length);
                            return (
                              <div
                                key={tile.id}
                                className={`${TILE} ${tileActive ? TILE_ACTIVE : ""} ${tileActive ? "" : "max-[1000px]:hidden"}`}
                              >
                                <Shot
                                  id={tile.id}
                                  alt={tile.alt}
                                  position={tile.position}
                                  width={400}
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
                      <div className="flex h-full gap-5">
                        <div className={FRAME}>
                          <div data-loop className={`${SCROLL_STACK} [animation-duration:12s]`}>
                            {RECEIPTS.map((id) => (
                              <Shot key={id} id={id} alt="Payment receipt" width={600} />
                            ))}
                          </div>
                        </div>
                        <div
                          className={`min-w-0 flex-1 pt-1.5 ${on ? "animate-[var(--animate-mps-enter)] [animation-delay:1s]" : ""}`}
                        >
                          <small className={MONO_KICKER}>Searching: March proof</small>
                          <Reel
                            items={PROOF_DATES}
                            className={`mt-2 h-[2.6em] ${REEL_TEXT}`}
                            animated={on && playing}
                          />
                          <small className={`mt-3 block ${MONO_KICKER} text-[#ef4444]`}>
                            Still scrolling · no match
                          </small>
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

      <div className="relative mx-auto mt-14 flex max-w-[440px] items-center gap-3.5 rounded-[14px] border border-[#ecedf3] bg-white/72 px-5 py-4 shadow-[0_12px_30px_rgba(15,29,110,0.08)] max-[560px]:mt-9">
        <i className="grid size-11 flex-none place-items-center rounded-[10px] bg-[#e4e7f9]">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0f1d6e"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" />
          </svg>
        </i>
        <div>
          <b className="block text-[17px] font-bold text-[#0f1d6e]">Your Solution Awaits.</b>
          <span className="block text-[15.5px] text-[#6b7280]">
            Experience financial transparency.
          </span>
        </div>
      </div>
    </section>
  );
}
