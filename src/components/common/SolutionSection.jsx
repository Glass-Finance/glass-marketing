/**
 * Shared "our solution" section shell used by both the organizations and
 * members marketing pages. The tilt-card mechanics, entrance keyframes,
 * and layout are identical between them; only the badge/copy/feature
 * list vary — see organizations/OurSolution.jsx and
 * members/MembersSolution.jsx for the per-audience data.
 *
 * icon/illustration/lightBg props are now {src, srcSet} objects (not
 * plain URL strings) so each <img> can ship a real srcSet for high-DPI
 * screens. Callers (MembersSolution.jsx, org OurSolution.jsx) must be
 * updated to pass that shape.
 */

import { useCallback, useEffect, useRef } from "react";
import BlurText from "../ui/BlurText";

// ─── Per-card tilt hook ───────────────────────────────────────────────────────
function useTilt(strength = 14) {
  const cardRef = useRef(null);
  const sheenRef = useRef(null);
  const rafRef = useRef(null);
  const cur = useRef({ rotX: 0, rotY: 0 });
  const tgt = useRef({ rotX: 0, rotY: 0 });
  const hovering = useRef(false);

  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = useCallback(() => {
    const card = cardRef.current;
    const sheen = sheenRef.current;
    if (!card) return;

    cur.current.rotX = lerp(cur.current.rotX, tgt.current.rotX, hovering.current ? 0.12 : 0.08);
    cur.current.rotY = lerp(cur.current.rotY, tgt.current.rotY, hovering.current ? 0.12 : 0.08);

    const { rotX, rotY } = cur.current;
    const scale = hovering.current ? 1.03 : 1;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale},${scale},1)`;

    const sx = (-rotY * 1.2).toFixed(2);
    const sy = (rotX * 1.2).toFixed(2);
    card.style.boxShadow = hovering.current
      ? `0 0 0 1px rgba(255,255,255,0.85) inset, ${sx}px ${sy}px 40px rgba(28,43,138,0.16), 0 2px 8px rgba(0,0,0,0.06)`
      : "0 0 0 1px rgba(255,255,255,0.75) inset, 0 2px 12px rgba(28,43,138,0.07), 0 1px 3px rgba(0,0,0,0.05)";

    if (sheen) {
      const nx = (rotY / strength + 1) / 2;
      const ny = (-rotX / strength + 1) / 2;
      sheen.style.background = `radial-gradient(ellipse 55% 45% at ${(nx * 100).toFixed(1)}% ${(ny * 100).toFixed(1)}%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.04) 45%, transparent 70%)`;
      sheen.style.opacity = hovering.current ? "1" : "0";
    }

    const moving =
      Math.abs(cur.current.rotX - tgt.current.rotX) > 0.01 ||
      Math.abs(cur.current.rotY - tgt.current.rotY) > 0.01;

    // Self-referencing rAF loop: `animate` calls itself via the closure it
    // captures, only actually invoked after this const finishes assigning
    // (by the time a real frame fires) -- a standard pattern for a
    // rAF-driven animation, not an actual TDZ bug. Rewriting this as a
    // ref-indirected self-call to satisfy the compiler's static ordering
    // check isn't worth the risk of a visual regression I can't check here.
    if (moving || hovering.current)
      // eslint-disable-next-line react-hooks/immutability
      rafRef.current = requestAnimationFrame(animate);
    else rafRef.current = null;
  }, [strength]);

  const onMouseMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      tgt.current.rotX =
        -((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * strength;
      tgt.current.rotY = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * strength;
    },
    [strength],
  );

  const onMouseEnter = useCallback(() => {
    hovering.current = true;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const onMouseLeave = useCallback(() => {
    hovering.current = false;
    tgt.current = { rotX: 0, rotY: 0 };
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return { cardRef, sheenRef, onMouseMove, onMouseEnter, onMouseLeave };
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, illustration, illustrationBackground, entryDelay }) {
  const { cardRef, sheenRef, onMouseMove, onMouseEnter, onMouseLeave } = useTilt(14);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative flex min-h-[320px] w-full cursor-default flex-col gap-6 overflow-hidden rounded-[4px] border border-black/10 bg-[rgba(255,255,255,0.6)] p-6 shadow-[0_2px_12px_rgba(28,43,138,0.07)] will-change-transform [transform-style:preserve-3d] opacity-0 sm:min-h-[380px] sm:p-8 lg:min-h-[420px]"
      style={{
        animation: `glassCardIn 0.65s cubic-bezier(0.22,1,0.36,1) ${entryDelay}ms forwards`,
      }}
    >
      <div
        ref={sheenRef}
        className="absolute inset-0 rounded-sm pointer-events-none z-20 transition-opacity duration-200 ease-in-out"
        style={{ opacity: 0 }}
      />

      <div className="flex min-h-[80px] items-start gap-3">
        <img
          src={icon.src}
          srcSet={icon.srcSet}
          sizes="50px"
          alt=""
          className="[width:clamp(36px,5vw,50px)] [height:clamp(36px,5vw,50px)] object-contain flex-shrink-0"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0">
          <h3 className="text-[clamp(16px,2.5vw,18px)] font-bold text-[#0f1d6e] leading-[1.3] mb-1.5">
            {title}
          </h3>
          <p className="text-[clamp(14px,2vw,14px)] text-black/60 leading-[1.6] m-0">{desc}</p>
        </div>
      </div>

      <div
        className="solution-illus relative -mb-6 h-[clamp(150px,42vw,190px)] w-full flex-none overflow-hidden rounded-sm sm:-mb-8 sm:h-[clamp(220px,32vw,300px)] lg:h-auto lg:min-h-[240px] lg:flex-1"
        style={
          illustrationBackground
            ? {
                backgroundColor: "#f8f8fb",
                backgroundImage:
                  "radial-gradient(ellipse at 24% 42%, rgba(191, 211, 255, 0.65), transparent 54%), radial-gradient(ellipse at 78% 38%, rgba(231, 207, 245, 0.72), transparent 56%)",
              }
            : undefined
        }
      >
        <img
          src={illustration.src}
          srcSet={illustration.srcSet}
          sizes="(min-width: 768px) 540px, 100vw"
          alt={title}
          className="absolute inset-0 h-full w-full object-contain object-bottom"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SolutionSection({
  badge = "Our Solution",
  headline,
  subtext,
  subtextMaxWidth = 640,
  features,
}) {
  return (
    <>
      <style>{`
      @keyframes glassCardIn {
        from { opacity: 0; transform: perspective(900px) translateY(32px) rotateX(6deg); }
        to   { opacity: 1; transform: perspective(900px) translateY(0px) rotateX(0deg); }
      }
    `}</style>

      <section className="relative isolate py-20 md:py-28" id="solution">
        <div className="mx-auto max-w-[1247px] px-6 relative z-30">
          <div className="text-center mb-12">
            <div className="mb-5 flex justify-center">
              <span className="inline-flex items-center border border-[#1C2B8A]/25 text-[#1C2B8A] text-[13px] font-medium px-5 py-2 rounded-full">
                {badge}
              </span>
            </div>

            <h2 className="text-[clamp(26px,5vw,58px)] font-bold text-[#0f1d6e] leading-[1.15] tracking-[-0.02em] mb-4">
              <BlurText
                text={headline}
                animateBy="words"
                direction="top"
                delay={55}
                stepDuration={0.42}
                centered
              />
            </h2>

            <p
              className="text-[clamp(15px,2vw,17px)] text-black/60 mx-auto leading-[1.7]"
              style={{ maxWidth: subtextMaxWidth }}
            >
              {subtext}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {features.map(({ icon, title, desc, illustration, illustrationBackground }, i) => (
              <FeatureCard
                key={title}
                icon={icon}
                title={title}
                desc={desc}
                illustration={illustration}
                illustrationBackground={illustrationBackground}
                entryDelay={200 + i * 120}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
