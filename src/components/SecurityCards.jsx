import { cldSrcSet, cldUrl } from "../lib/cloudinary";

const ICON_WIDTHS = [28, 56, 84];

const claims = [
  {
    icon: "glass/security/icon1",
    title: "Transparency",
    description: "Every fee is shown before you pay. Your community always receives the full due.",
  },
  {
    icon: "glass/security/icon2",
    title: "Data Rights",
    description: "Your rights: access, correction, and deletion are set out in our Privacy Policy.",
  },
  {
    icon: "glass/security/icon3",
    title: "Encryption",
    description: "Sensitive fields use column-level AES-256 encryption.",
  },
];

function SecurityCard({ claim, index }) {
  const icon = {
    src: cldUrl(claim.icon, { width: 84 }),
    srcSet: cldSrcSet(claim.icon, ICON_WIDTHS),
  };

  return (
    <article
      className={`flex min-h-[440px] w-[360px] max-w-full flex-col items-center rounded-g-4 border border-black/10 bg-[rgba(255,255,255,0.6)] px-6 pt-20 pb-6 text-center transition-transform duration-700 ${index === 0 ? "justify-between security-card-tilt-left" : "gap-10"} ${index === 2 ? "security-card-tilt-right" : ""}`}
    >
      <div className="relative grid size-[170px] shrink-0 place-items-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(107,47,181,0.35)_0%,rgba(107,47,181,0.18)_45%,transparent_75%)] blur-[20px]"
        />
        <span className="relative z-10 grid size-[78px] place-items-center rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.35),0_4px_20px_rgba(0,31,110,0.1)]">
          <img
            src={icon.src}
            srcSet={icon.srcSet}
            sizes="28px"
            alt=""
            className="size-7 object-contain"
            loading="lazy"
            decoding="async"
          />
        </span>
      </div>
      <div>
        <h3 className="mb-3 text-[18px] font-bold leading-[1.25] text-brand-navy">{claim.title}</h3>
        <p className="m-0 max-w-[300px] text-[14px] leading-[1.65] text-black/50">
          {claim.description}
        </p>
      </div>
    </article>
  );
}

export default function SecurityCards({ showTribuneBanner = false }) {
  return (
    <section className="relative isolate overflow-hidden py-20 md:py-28" id="security">
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <header className="mb-8 text-center md:mb-16">
          <div className="mb-[clamp(16px,4vw,28px)] flex justify-center">
            <span className="inline-flex items-center rounded-full border border-brand-navy/25 px-5 py-2 text-[13px] font-medium text-brand-navy">
              Security &amp; Trust
            </span>
          </div>
          <h2 className="mx-auto mb-4 max-w-[1080px] text-[clamp(32px,5.5vw,58px)] font-bold leading-tight tracking-tight text-brand-navy">
            Security for your peace of mind
          </h2>
          <p className="mx-auto max-w-[700px] text-[17px] leading-relaxed text-black/60">
            Clear payment terms, data rights, and encryption for sensitive fields.
          </p>
        </header>

        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
          {claims.map((claim, index) => (
            <SecurityCard key={claim.title} claim={claim} index={index} />
          ))}
        </div>

        {showTribuneBanner ? (
          <aside className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-sm border border-[#002fa7]/25 bg-[#ccdaff] px-6 py-5">
            <div>
              <h3 className="text-[18px] font-medium leading-7 text-black">
                Why the Nigerian Tribune is Talking About Glass
              </h3>
              <p className="text-[16px] leading-6 text-black/70">
                Discover how Glass is redefining community finances.
              </p>
            </div>
            <a
              href="https://tribuneonlineng.com/team-glass-shines-as-winner-of-5th-babcock-innovation-challenge/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-sm border border-brand-navy/60 px-3 py-1.5 text-[12px] font-medium text-brand-navy no-underline transition-colors hover:bg-brand-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Check It Out
            </a>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
