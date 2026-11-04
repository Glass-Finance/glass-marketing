import { useNavigate } from "react-router-dom";
import { goToApp } from "../../utils/deviceRedirect";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../Reveal";
import { motion } from "motion/react";
import { useEffect } from "react";
import { cldUrl, cldVideoUrl } from "../../lib/cloudinary";
import { LandingCta } from "../ui/LandingCta";

// Previously `const waveBg = "/hero.webp"` — a raw path into the public/
// folder that bypassed Vite's asset pipeline entirely and was silently
// serving an unoptimized file while MembersHero.jsx (a Vite-imported
// asset) got build-time optimization. Both heroes now go through the same
// cldUrl() helper and the same public_id, so they can't diverge again.
const waveBg = cldUrl("glass/hero/hero", { width: 1920 });
const dashboardVideo = cldVideoUrl("glass/hero/dashboard-animation");

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      root.style.scrollBehavior = prevBehavior;
    });
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
      @media (max-width: 640px) {
        .hero-wave-bg { animation: none !important; transform: scale(1.06) !important; will-change: auto !important; }
        .hero-blur-blobs { display: none !important; }
      }
    `}</style>
      <section className="relative overflow-hidden pt-[120px]">
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
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(2,3,16,0.91) 0%, rgba(5,4,26,0.88) 40%, rgba(12,4,24,0.83) 100%)",
          }}
        />
        <canvas
          id="hero-static-canvas"
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            width: "100%",
            height: "100%",
            opacity: 0.035,
            mixBlendMode: "screen",
          }}
        />
        <div className="hero-blur-blobs pointer-events-none absolute inset-0 select-none overflow-hidden">
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[560px]"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 50% 100%, #5a0a5a 0%, #300840 45%, transparent 72%)",
              filter: "blur(55px)",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[320px]"
            style={{
              background: "radial-gradient(ellipse at bottom left, #6b0a4a 0%, transparent 60%)",
              filter: "blur(80px)",
              opacity: 0.45,
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-[200px]"
            style={{
              background: "linear-gradient(to bottom, rgba(2,3,16,0.85) 0%, transparent 100%)",
            }}
          />
        </div>

        <div
          className="relative z-10 w-full max-w-[720px] mx-auto text-center px-6 pb-8"
          style={{ fontFamily: "Inter,-apple-system,sans-serif" }}
        >
          <Reveal variant="up" delay={80}>
            <h1 className="mx-auto mb-5 max-w-[885px] text-center text-[clamp(34px,6vw,64px)] font-bold leading-[1.05] tracking-tight text-white">
              Manage Community Payments Effortlessly.
            </h1>
          </Reveal>
          <Reveal variant="up" delay={160}>
            <p className="mx-auto mb-8 max-w-[767px] text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
              Create payment plans, collect dues and contributions, and track every member&apos;s
              payment in one place. No more chasing transfers or updating spreadsheets.
            </p>
          </Reveal>
          <Reveal variant="up" delay={240}>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <LandingCta
                radius="sm"
                onClick={() => goToApp("/sign-up", navigate)}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 10;
                  const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 6;
                  e.currentTarget.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(1.04)`;
                  e.currentTarget.style.boxShadow =
                    "0 18px 48px rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(0,0) scale(1)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                Create Your Community
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ display: "inline-flex", alignItems: "center" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </LandingCta>
            </div>
          </Reveal>
        </div>

        <Reveal variant="up" delay={360}>
          <div className="relative z-10 w-full px-4 sm:px-8 pb-0">
            <div className="mx-auto aspect-[4/3] w-full max-w-[960px] overflow-hidden rounded-t-[12px] border border-white/10 bg-[#111] shadow-[0_32px_100px_rgba(0,0,0,0.7)] sm:aspect-[16/10] sm:rounded-t-[16px] lg:aspect-video">
              <video
                className="block h-full w-full object-cover object-top"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Animated preview of the Glass community payments dashboard"
              >
                <source src={dashboardVideo} type="video/webm" />
              </video>
            </div>
          </div>
        </Reveal>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 hidden sm:block"
          style={{
            height: "130px",
            background:
              "linear-gradient(to top, rgba(229,229,229,0.97) 0%, rgba(229,229,229,0.65) 35%, rgba(229,229,229,0.1) 75%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 block sm:hidden"
          style={{
            height: "70px",
            background:
              "linear-gradient(to top, rgba(229,229,229,0.95) 0%, rgba(229,229,229,0.5) 40%, transparent 100%)",
          }}
        />
      </section>
    </>
  );
}
