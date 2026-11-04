import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { goToApp } from "../../utils/deviceRedirect";
import { cldUrl } from "../../lib/cloudinary";
import BlurText from "../ui/BlurText";
import VariableProximity from "../ui/VariableProximity";
import { ScaledPhoneHeroDemo } from "./PhoneHeroDemo";
import { LandingCta } from "../ui/LandingCta";

const waveBg = cldUrl("glass/hero/hero", { width: 1920 });

export default function MembersHero() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  function handleJoin() {
    setIsRedirecting(true);
    goToApp("/member/join", navigate);
  }

  useEffect(() => {
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      root.style.scrollBehavior = prevBehavior;
    });
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("members-hero-canvas");
    if (!canvas) return;
    const draw = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
      const ctx = canvas.getContext("2d");
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() > 0.5 ? 255 : 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <>
      <style>{`
      @keyframes waveDrift {
        0%   { transform: scale(1.06) translate(0px, 0px); }
        30%  { transform: scale(1.09) translate(-16px, -8px); }
        65%  { transform: scale(1.07) translate(12px, -14px); }
        100% { transform: scale(1.06) translate(0px, 0px); }
      }
      @media (max-width: 1023px) {
        .hero-wave-bg { animation: none !important; transform: scale(1.06) !important; will-change: auto !important; }
        .hero-blur-blobs { display: none !important; }
      }
    `}</style>
      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col justify-center pt-[68px] overflow-hidden"
      >
        <div
          className="hero-wave-bg absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${waveBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "waveDrift 28s ease-in-out infinite",
            willChange: "transform",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,3,18,0.82)_0%,rgba(3,4,22,0.78)_35%,rgba(6,3,20,0.65)_60%,rgba(10,4,24,0.45)_100%)]" />

        <canvas
          id="members-hero-canvas"
          className="absolute inset-0 pointer-events-none select-none w-full h-full opacity-[0.035] mix-blend-screen"
        />

        {/* ── DESKTOP ONLY (lg / 1024px+) ──
            Previously triggered at `sm` (640px), which forced this
            side-by-side composition down into tablet-portrait widths
            (768–1023px). At those widths there simply isn't enough
            leftover horizontal space after the text column for the phone
            to read as anything but a small, isolated element stuck at the
            bottom of a too-tall, too-narrow column -- no width/flex value
            fixes that, because splitting a ~768-900px viewport into two
            columns inside a full-viewport-height section is the wrong
            composition at that size, not a wrong number. Tablet now uses
            the stacked mobile layout below instead, same as phones -- true
            side-by-side only kicks in at real desktop/laptop widths. */}
        <div className="hidden lg:flex relative z-10 w-full max-w-[1280px] mx-auto px-8 lg:px-16 gap-6 lg:gap-10 min-h-[calc(100vh-68px)] flex-row items-center">
          <div
            ref={containerRef}
            className="flex flex-col justify-start pt-8 w-[45%] flex-shrink-0 relative -mt-[60px]"
          >
            <div className="text-[clamp(38px,5.8vw,62px)] font-bold leading-[1.05] tracking-[-0.03em] mb-0.5">
              <BlurText
                text="Pay Your Dues"
                delay={80}
                animateBy="words"
                direction="top"
                stepDuration={0.36}
                className="text-white block"
              />
            </div>

            <div className="mb-6 text-white text-[clamp(38px,5.8vw,62px)] font-bold leading-[1.05] tracking-[-0.03em]">
              <BlurText
                text="Effortlessly"
                delay={400}
                animateBy="words"
                direction="top"
                stepDuration={0.42}
                className="block"
              />
            </div>

            <div className="mb-8 max-w-[420px]">
              <VariableProximity
                label="Stop sending screenshots of receipts. Get instant proof of payment, track your history, and never miss a deadline again."
                s
                fromFontVariationSettings="'wght' 300, 'opsz' 9"
                toFontVariationSettings="'wght' 700, 'opsz' 40"
                containerRef={containerRef}
                radius={140}
                falloff="gaussian"
                className="text-[15px] text-[rgba(255,255,255,0.55)] leading-[1.7]"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: 1.4,
              }}
            >
              <LandingCta
                radius="sm"
                onClick={handleJoin}
                loading={isRedirecting}
                className="shadow-lg shadow-black/30"
              >
                {isRedirecting ? "Redirecting…" : "Join A Community"}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-flex items-center"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.span>
              </LandingCta>
            </motion.div>
          </div>

          {/* Right: iPhone — flex-1 fills whatever's left after the fixed
              45% text column; at real lg+ widths (1024px+) that's always
              a healthy amount of space, unlike the old sm-triggered
              version where "whatever's left" could be a cramped 150-250px. */}
          <div className="relative self-stretch flex items-end justify-start min-w-0 flex-1 pb-0">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.25,
              }}
              className="w-full -ml-[60px] relative"
            >
              <ScaledPhoneHeroDemo className="relative block" maxWidth={560} />
            </motion.div>
          </div>
        </div>

        {/* ── MOBILE + TABLET (below lg / up to 1023px) ──
            Now covers real tablet-portrait widths too, not just phones --
            same stacked composition (text flows naturally, phone follows
            at full width below it, no forced full-viewport-height column
            fighting for space). clamp()-based type sizes scale up
            naturally on wider tablet widths without needing a third set
            of breakpoint-specific values. */}
        <div className="lg:hidden absolute top-[68px] left-0 right-0 bottom-0 z-10 flex flex-col">
          <div ref={containerRef} className="px-6 sm:px-12 pt-20 sm:pt-16 relative">
            <div className="text-[clamp(38px,10vw,68px)] font-semibold leading-[1.05] tracking-[-0.03em] mb-0.5">
              <BlurText
                text="Pay Your Dues"
                delay={80}
                animateBy="words"
                direction="top"
                stepDuration={0.36}
                className="text-white block"
              />
            </div>
            <div className="mb-6 text-white text-[clamp(38px,10vw,74px)] font-semibold leading-[1.05] tracking-[-0.03em]">
              <BlurText
                text="Effortlessly"
                delay={400}
                animateBy="words"
                direction="top"
                stepDuration={0.42}
                className="block"
              />
            </div>
            <p className="text-[15px] sm:text-[18px] leading-relaxed mb-8 max-w-[300px] sm:max-w-[480px] text-white/50">
              Stop sending screenshots of receipts. Get instant proof of payment, track your
              history, and never miss a deadline again.
            </p>
            <LandingCta
              radius="sm"
              onClick={handleJoin}
              loading={isRedirecting}
              className="shadow-lg shadow-black/30"
            >
              {isRedirecting ? "Redirecting…" : "Join A Community"}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </LandingCta>
          </div>

          {/* Phone — text stays left-anchored (px-6/px-12 above), no
              centering wrapper. Bumped substantially wider on tablet
              (sm:w-[540px], up from 420/460) so it grows to fill the
              middle gap on its own instead of the layout centering
              everything as one block. */}
          <div className="relative flex-1 flex justify-center items-end overflow-hidden">
            <div className="relative w-[330px] sm:w-[540px] drop-shadow-[0_16px_40px_rgba(120,10,160,0.5)]">
              <ScaledPhoneHeroDemo />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 hidden lg:block h-10 bg-[linear-gradient(to_top,rgba(229,229,229,0.97)_0%,rgba(229,229,229,0.65)_35%,rgba(229,229,229,0.1)_75%,transparent_100%)]" />
      </section>
    </>
  );
}
