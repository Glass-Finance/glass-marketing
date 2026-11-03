const claims = [
  {
    title: "Transparency",
    description: "Every kobo is accounted for. No hidden fees or missing funds.",
    icon: "✓",
  },
  {
    title: "Data Rights",
    description: "Your rights to access, correct, and delete personal data are respected.",
    icon: "↗",
  },
  {
    title: "Encryption",
    description:
      "Sensitive data is AES-256 encrypted at rest and protected by TLS while in transit.",
    icon: "⌑",
  },
];

export default function OrganizationSecurity() {
  return (
    <section
      id="security"
      className="relative isolate overflow-hidden bg-[#f9f9fb] px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1218px]">
        <header className="mx-auto max-w-[1078px] text-center">
          <span className="inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-[13px] font-medium text-brand-navy">
            Security &amp; Trust
          </span>
          <h2 className="mt-5 text-balance text-[clamp(34px,5vw,56px)] font-bold leading-tight text-brand-navy">
            Bank-grade security for your peace of mind
          </h2>
          <p className="mx-auto mt-3 max-w-[862px] text-[16px] leading-7 text-[#808080] md:text-[18px]">
            We protect your funds with secure payment processing and encryption, and keep your
            community data private.
          </p>
        </header>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {claims.map(({ title, description, icon }) => (
            <article
              key={title}
              className="flex min-h-[300px] flex-col items-center rounded-g-4 border border-black/10 bg-white/60 px-6 py-10 text-center"
            >
              <span
                aria-hidden="true"
                className="grid size-[110px] place-items-center rounded-full bg-white text-[38px] font-semibold text-brand-navy shadow-[0_12px_60px_20px_rgba(187,154,229,0.16)]"
              >
                {icon}
              </span>
              <h3 className="mt-8 text-[22px] font-medium text-brand-navy md:text-[24px]">
                {title}
              </h3>
              <p className="mt-2 max-w-[320px] text-[16px] leading-7 text-black/60 md:text-[18px]">
                {description}
              </p>
            </article>
          ))}
        </div>

        <aside className="mt-8 flex flex-wrap items-center justify-between gap-6 border border-[#002fa7] bg-[#ccdaff] px-6 py-5">
          <div>
            <h3 className="text-[18px] font-medium leading-7 text-black">
              Why the Nigerian Tribune is talking about Glass
            </h3>
            <p className="text-[16px] leading-6 text-black/70">
              See how Team Glass won the ₦1,000,000 grand prize at the 5th Babcock Innovation
              Challenge.
            </p>
          </div>
          <a
            href="https://tribuneonlineng.com/team-glass-shines-as-winner-of-5th-babcock-innovation-challenge/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded border border-brand-navy px-6 py-3 text-[14px] font-medium text-brand-navy no-underline transition-colors hover:bg-brand-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Check It Out
          </a>
        </aside>
      </div>
    </section>
  );
}
