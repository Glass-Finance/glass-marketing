import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { goToApp } from "../../utils/deviceRedirect";

// ── How it works ────────────────────────────────────────────────────────────
// Ported from the reference design (how-it-works.html): four full-width
// cards, each a purple panel holding a bordered frame with an app screenshot
// on one side and a circled icon + title on the other. Sides alternate.
//
// Geometry is expressed in the card's own coordinate space, so every value
// is a percentage of the 1216x587 card and the whole card scales with the
// viewport via container queries (see .hiw-* in index.css):
//   ix       – left offset of the info block (text/icon), % of card width
//   ar       – aspect ratio of the screenshot box, used once on mobile
//   dir      – which way the screenshot slides in (+1 right, -1 left)
//   framePos – the bordered frame, % of the card
//   screenPos– the screenshot inside its frame, % of the frame
const STEPS = [
  {
    ix: "1.97%",
    ar: "596/480",
    dir: "1",
    lines: ["Create your Community and", "get started!"],
    icon: "/hiw/icon-1.svg",
    screen: "/hiw/step-1.webp",
    screenAlt: "Glass asking whether to create a new community or join an existing one",
    framePos: { left: "49.095%", top: "4.940%", width: "57.566%", height: "89.949%" },
    screenPos: { left: "3.286%", top: "4.545%", width: "85.143%", height: "90.909%" },
  },
  {
    ix: "66.4%",
    ar: "622/480",
    dir: "-1",
    lines: ["Add Your Members"],
    icon: "/hiw/icon-2.svg",
    screen: "/hiw/step-2.webp",
    screenAlt: "The Add Members screen with a CSV upload table of community members",
    framePos: { left: "3.536%", top: "7.155%", width: "55.099%", height: "89.949%" },
    screenPos: { left: "3.582%", top: "4.545%", width: "92.836%", height: "90.909%" },
  },
  {
    ix: "1.97%",
    ar: "497/480",
    dir: "1",
    lines: ["Create Your Payment Plan"],
    icon: "/hiw/icon-3.svg",
    screen: "/hiw/step-3.webp",
    screenAlt:
      "The Create Payment Plan form with plan name, description, amount per member and frequency fields",
    framePos: { left: "52.385%", top: "5.111%", width: "44.819%", height: "89.779%" },
    screenPos: { left: "4.404%", top: "4.554%", width: "91.193%", height: "91.082%" },
  },
  {
    ix: "64.06%",
    ar: "640/480",
    dir: "-1",
    lines: ["Launch Your", "Community"],
    icon: "/hiw/icon-4.svg",
    screen: "/hiw/step-4.webp",
    screenAlt: "A confirmation screen reading Your Community Is Now Live",
    framePos: { left: "1.398%", top: "4.940%", width: "56.579%", height: "89.779%" },
    screenPos: { left: "3.488%", top: "4.554%", width: "93.023%", height: "91.082%" },
  },
];

export default function OrganizationHowItWorks() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const onCtaClick = () => goToApp("/sign-up", navigate);

  // One orchestrated reveal per card, played once when it scrolls into view.
  // Cards reveal strictly in order: a card waits for the one above it, so a
  // fast scroll still reads as a sequence rather than everything popping at
  // once. With no IntersectionObserver the whole set shows immediately.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const cards = Array.from(root.querySelectorAll(".hiw-card"));
    if (!cards.length) return undefined;

    const revealAll = () => cards.forEach((card) => card.classList.add("is-in"));
    if (!("IntersectionObserver" in window)) {
      revealAll();
      return undefined;
    }

    const seen = new Array(cards.length).fill(false);
    let next = 0;
    let observer = null;
    const flush = () => {
      while (next < cards.length && seen[next]) {
        cards[next].classList.add("is-in");
        next += 1;
      }
      if (next >= cards.length && observer) observer.disconnect();
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) seen[cards.indexOf(entry.target)] = true;
        });
        flush();
      },
      { threshold: 0.35 },
    );
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="mx-auto w-full max-w-[1216px] px-5 py-[clamp(48px,8vw,104px)]"
      id="how-it-works"
    >
      <header className="mb-[clamp(32px,5vw,56px)] max-w-[560px]">
        <h2 className="text-[clamp(32px,4.4vw,48px)] font-bold leading-[1.05] tracking-[-0.03em] text-[#0d0d12]">
          How it works
        </h2>
        <p className="mt-[14px] text-[17px] leading-[1.5] text-[#5d5d6b]">
          From an empty workspace to a live community that collects payments, in four steps.
        </p>
      </header>

      <div className="hiw-cards">
        {STEPS.map((step, i) => (
          <article
            key={step.screen}
            className="hiw-card"
            aria-label={`Step ${i + 1}`}
            style={{ "--ix": step.ix, "--ar": step.ar, "--dir": step.dir }}
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
                <img src={step.screen} alt={step.screenAlt} />
              </div>
            </div>
          </article>
        ))}
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
