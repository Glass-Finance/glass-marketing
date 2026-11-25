import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { goToApp } from "../../utils/deviceRedirect";

// ── How it works (members) ──────────────────────────────────────────────────
// Same format as OrganizationHowItWorks: ONE purple card that plays through
// the steps. Each step is a "scene" (circled icon + title + framed
// screenshot); all scenes are stacked in the same card and only the active one
// is visible, so switching steps swaps the content, not the card. Styling is
// the shared .hiw-* block in index.css — nothing new to add there except the
// two one-line radius tweaks noted in the hand-off.
//
// Geometry is in the card's own coordinate space (1216x587):
//   ix        – left offset of the info block (icon + title), % of card width
//   ar        – aspect ratio of the screenshot box, used once on mobile
//   dir       – which way the screenshot slides in (+1 right, -1 left)
//   radius    – corner radius of the screenshot (--hiw-r). Steps 1 and 2 are
//               mobile screens that run off the bottom of the card, so their
//               bottom corners are square, as in the design.
//   framePos  – the bordered frame, % of the card. On steps 1 and 2 the frame
//               is taller than the card on purpose: the card clips it, which
//               is what makes the screen look like it continues below.
//   screenPos – the screenshot inside its frame, % of the frame
//
// Playback: starts the first time the card is ~40% on screen and advances
// every STEP_MS. It holds while the pointer is over the card and while the
// card is off-screen; swiping on touch jumps a step. With
// prefers-reduced-motion there is no autoplay, so the first step simply
// stays put (swipe still works).
const STEPS = [
  {
    ix: "1.974%",
    ar: "500/499",
    dir: "1",
    radius: "4px 4px 0 0",
    lines: ["Sign up for Glass in seconds."],
    icon: "/hiw/m-icon-1.svg",
    screen: "/hiw/m-step-1.webp",
    screenAlt: "The Glass Create Your Account screen with an email address field and a Continue button",
    framePos: { left: "50.000%", top: "10.903%", width: "45.066%", height: "97.274%" },
    screenPos: { left: "4.380%", top: "4.203%", width: "91.241%", height: "87.391%" },
  },
  {
    ix: "53.947%",
    ar: "467/494",
    dir: "-1",
    radius: "12px 12px 0 0",
    lines: ["Accept Your Community", "Invite."],
    icon: "/hiw/m-icon-2.svg",
    screen: "/hiw/m-step-2.webp",
    screenAlt:
      "The Glass Notifications screen showing an invitation to join the Arsenal Club Fans community, with Accept and Decline buttons",
    framePos: { left: "4.276%", top: "11.755%", width: "42.352%", height: "96.422%" },
    screenPos: { left: "4.660%", top: "4.240%", width: "90.680%", height: "87.279%" },
  },
  {
    ix: "1.97%",
    ar: "496/480",
    dir: "1",
    radius: "4px",
    lines: ["Create Your Payment Plan"],
    icon: "/hiw/m-icon-3.svg",
    screen: "/hiw/m-step-3.webp",
    screenAlt:
      "The Create Payment Plan form with plan name, description, amount per member and frequency fields",
    framePos: { left: "52.385%", top: "5.111%", width: "44.819%", height: "89.779%" },
    screenPos: { left: "4.404%", top: "4.554%", width: "91.193%", height: "91.082%" },
  },
];

const COUNT = STEPS.length;
const STEP_MS = 6000; // time each step stays on screen

export default function MemberHowItWorks() {
  const navigate = useNavigate();
  const slotRef = useRef(null);
  const swipeX = useRef(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false); // first time on screen
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const onCtaClick = () => goToApp("/sign-up", navigate);

  // Observe the plain wrapper, never the card itself: the card starts fully
  // clipped (clip-path), and an IntersectionObserver reads a clipped target as
  // 0% visible, so it would never fire.
  useEffect(() => {
    const el = slotRef.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) {
      setStarted(true);
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const go = (i) => setActive(((i % COUNT) + COUNT) % COUNT);

  // Autoplay. Re-armed whenever the step changes (so a swipe restarts the
  // full dwell time), and cleared while held, off-screen or unmounted.
  useEffect(() => {
    if (!started || !inView || hovered) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setTimeout(() => setActive((a) => (a + 1) % COUNT), STEP_MS);
    return () => clearTimeout(id);
  }, [started, inView, hovered, active]);

  const onSwipeEnd = (e) => {
    if (swipeX.current == null) return;
    const dx = e.changedTouches[0].clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      className="mx-auto w-full max-w-[1216px] px-5 py-[clamp(48px,8vw,104px)]"
      id="how-it-works"
    >
      <div className="text-center mb-12">
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center border border-brand-deep/25 text-brand-deep text-[13px] font-medium px-5 py-2 rounded-full">
            How We Work
          </span>
        </div>

        <h2 className="text-balance text-[clamp(26px,5vw,58px)] font-bold text-brand-ink leading-[1.15] tracking-[-0.02em] mb-4">
          Launch Transparent Payments in Minutes
        </h2>

        <p
          className="text-[clamp(15px,2vw,17px)] text-black/60 mx-auto leading-[1.7]"
          style={{ maxWidth: "720px" }}
        >
          Set up your community, link member payment methods, and let Glass handle the rest.
        </p>
      </div>

      <div
        ref={slotRef}
        className="hiw-slot"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`hiw-card${started ? " is-in" : ""}`}
          role="group"
          aria-roledescription="carousel"
          aria-label={`How it works, step ${active + 1} of ${COUNT}`}
          onTouchStart={(e) => {
            swipeX.current = e.touches[0].clientX;
          }}
          onTouchEnd={onSwipeEnd}
        >
          {STEPS.map((step, i) => (
            <article
              key={step.screen}
              className={`hiw-scene${started && i === active ? " is-active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${COUNT}`}
              aria-hidden={i !== active}
              style={{
                "--ix": step.ix,
                "--ar": step.ar,
                "--dir": step.dir,
                "--hiw-r": step.radius,
              }}
            >
              <div className="hiw-info">
                <div className="hiw-ico">
                  <img src={step.icon} alt="" width="72" height="72" aria-hidden="true" />
                </div>
                <h3>
                  {step.lines.map((line) => (
                    <span key={line} className="hiw-ln">
                      <span>{line}</span>
                    </span>
                  ))}
                </h3>
              </div>
              <div className="hiw-frame" style={step.framePos}>
                <div className="hiw-screen" style={step.screenPos}>
                  <img src={step.screen} alt={step.screenAlt} decoding="async" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center md:mt-20">
        <motion.button
          onClick={onCtaClick}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex items-center gap-3 rounded-sm bg-[#002fa7] px-8 py-4 text-[14px] font-bold text-white shadow-2xl shadow-[#002fa7]/25"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
            whileHover={{ translateX: "250%" }}
            transition={{ duration: 0.5 }}
          />
          <span className="relative z-10">Join Glass</span>
          <motion.svg
            className="relative z-10"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </motion.svg>
        </motion.button>
      </div>
    </section>
  );
}