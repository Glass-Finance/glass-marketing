import { useEffect, useRef } from "react";
import { CheckCircle, Phone, Mail, Edit3, MoreHorizontal } from "lucide-react";

const claims = [
  {
    id: "transparency",
    title: "Transparency",
    description: "Every fee is shown before you pay. Your community always receives the full due.",
  },
  {
    id: "privacy",
    title: "Data Privacy",
    description: "Your rights: access, correction, and deletion are set out in our Privacy Policy.",
  },
  {
    id: "encryption",
    title: "End-to-End Encryption",
    description: "Sensitive fields use column-level AES-256 encryption.",
  },
];

/* ── Transparency card: payment breakdown mockup ── */
function TransparencyMockup() {
  return (
    <div className="security-transparency relative w-full max-w-[320px]">
      {/* State 1: Payment Breakdown */}
      <div className="state-breakdown rounded-[12px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h4 className="mb-3 text-[15px] font-semibold text-black">Payment Breakdown</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-black/60">Community dues:</span>
            <span className="font-medium text-black">₦5,000.00</span>
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-black/60">Transaction Fee:</span>
            <span className="font-medium text-black">₦50.00</span>
          </div>
        </div>
      </div>

      {/* State 2: Community Receives */}
      <div className="state-received absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-2 rounded-[8px] bg-[#ccffcc] px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <CheckCircle className="size-5 text-green-600" strokeWidth={2.5} />
          <span className="text-[14px] font-medium text-black">Community Receives ₦5,000.00</span>
        </div>
      </div>
    </div>
  );
}

/* ── Data Privacy card: member editing mockup ── */
function DataPrivacyMockup() {
  return (
    <div className="security-privacy relative w-full max-w-[320px]">
      {/* State 1: Profile with phone number */}
      <div className="state-profile rounded-[12px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-black">Tunde Adegbite</div>
            <div className="text-[12px] text-black/50">Member</div>
          </div>
          <MoreHorizontal className="size-5 text-black/40" />
        </div>
        <div className="mt-3 border-t border-black/5 pt-3">
          <div className="text-[12px] text-black/50">Phone Number</div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-black">0803 000 5678</span>
            <span className="security-badge-pulse rounded-[4px] bg-[#ccffcc] px-2 py-0.5 text-[11px] font-medium text-green-700">
              Updated
            </span>
          </div>
        </div>
      </div>

      {/* State 2: Dropdown with edit options */}
      <div className="state-dropdown absolute inset-0 flex items-center justify-center">
        <div className="rounded-[12px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-black">Tunde Adegbite</div>
              <div className="text-[12px] text-black/50">Member</div>
            </div>
            <div className="flex items-center gap-1 text-[13px] font-medium text-blue-600">
              <Edit3 className="size-3" />
              Edit
            </div>
          </div>
          <div className="mt-3 border-t border-black/5 pt-3">
            <div className="text-[12px] text-black/50">Email</div>
            <div className="text-[15px] font-medium text-black">sulai**m@gmail.com</div>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex items-center gap-1.5 rounded-[6px] border border-black/10 px-3 py-1.5 text-[13px] text-black/70">
              <Phone className="size-3" />
              Phone Number
            </div>
            <div className="flex items-center gap-1.5 rounded-[6px] border border-black/10 px-3 py-1.5 text-[13px] text-black/70">
              <Mail className="size-3" />
              Email
            </div>
          </div>
        </div>
      </div>

      {/* State 3: Toast notification */}
      <div className="state-toast absolute inset-0 flex items-center justify-center">
        <div className="security-toast-enter flex items-center gap-2 rounded-[8px] bg-[#ccffcc] px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <CheckCircle className="size-5 text-green-600" strokeWidth={2.5} />
          <span className="text-[14px] font-medium text-black">Phone Number Updated!</span>
        </div>
      </div>

      {/* State 4: Member Information */}
      <div className="state-member-info absolute inset-0 flex items-center justify-center">
        <div className="w-full rounded-[12px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="text-[14px] font-semibold text-black">Member Information</div>
          <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
            <div>
              <div className="text-[12px] text-black/50">Email:</div>
              <div className="text-[14px] font-medium text-black">sulai**m@gmail.com</div>
            </div>
            <div>
              <div className="text-[12px] text-black/50">Phone Number:</div>
              <div className="text-[14px] font-medium text-black">0803 000 5678</div>
            </div>
          </div>
        </div>
      </div>

      {/* State 5: Protected Information */}
      <div className="state-protected absolute inset-0 flex items-center justify-center">
        <div className="w-full rounded-[12px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="text-[14px] font-semibold text-black">Protected Information</div>
          <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
            <div className="text-[14px] font-medium text-black">a8F#2kP9@zQ4</div>
            <div className="text-[14px] font-medium text-black">X7$mL3fvR0pB</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Encryption card: member info → encrypted transition ── */
function EncryptionMockup() {
  return (
    <div className="security-encryption relative w-full max-w-[320px]">
      {/* State 1: Member Information */}
      <div className="state-member rounded-[12px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div className="text-[14px] font-semibold text-black">Member Information</div>
        <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
          <div>
            <div className="text-[12px] text-black/50">Email:</div>
            <div className="text-[14px] font-medium text-black">sulai**m@gmail.com</div>
          </div>
          <div>
            <div className="text-[12px] text-black/50">Phone Number:</div>
            <div className="text-[14px] font-medium text-black">0803 000 5678</div>
          </div>
        </div>
      </div>

      {/* State 2: Protected/Encrypted Information */}
      <div className="state-encrypted absolute inset-0 flex items-center justify-center">
        <div className="w-full rounded-[12px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="text-[14px] font-semibold text-black">Protected Information</div>
          <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
            <div className="text-[14px] font-medium text-black">a8F#2kP9@zQ4</div>
            <div className="text-[14px] font-medium text-black">X7$mL3fvR0pB</div>
          </div>
        </div>
      </div>

      {/* Purple glow effect */}
      <div className="security-glow" aria-hidden="true" />
    </div>
  );
}

/* ── Card renderer ── */
function SecurityCard({ claim, index }) {
  const MockupComponent =
    claim.id === "transparency"
      ? TransparencyMockup
      : claim.id === "privacy"
        ? DataPrivacyMockup
        : EncryptionMockup;

  return (
    <article
      className={`security-card-bg flex w-full max-w-[400px] flex-col items-center rounded-[20px] border border-black/5 p-6 transition-transform duration-700 ${index === 0 ? "security-card-tilt-left" : index === 2 ? "security-card-tilt-right" : ""}`}
    >
      <div className="flex min-h-[280px] w-full items-center justify-center">
        <MockupComponent />
      </div>
      <div className="mt-6 text-center">
        <h3 className="mb-2 text-[20px] font-semibold text-brand-navy">{claim.title}</h3>
        <p className="mx-auto max-w-[300px] text-[15px] leading-relaxed text-black/60">
          {claim.description}
        </p>
      </div>
    </article>
  );
}

export default function SecurityCards({ showTribuneBanner = false }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    // Trigger animations when cards scroll into view
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 },
      );

      const cards = root.querySelectorAll(".security-card-bg");
      cards.forEach((card) => observer.observe(card));

      return () => observer.disconnect();
    }

    return undefined;
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden py-20 md:py-28"
      id="security"
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <header className="mb-8 text-center md:mb-16">
          <div className="mb-[clamp(16px,4vw,28px)] flex justify-center">
            <span className="inline-flex items-center rounded-full border border-brand-navy/25 px-5 py-2 text-[13px] font-medium text-brand-navy">
              Security &amp; Trust
            </span>
          </div>
          <h2 className="mx-auto mb-4 max-w-[1080px] text-[clamp(32px,5.5vw,58px)] font-bold leading-tight tracking-tight text-brand-navy">
            Built on Trust, Secured by Design
          </h2>
          <p className="mx-auto max-w-[700px] text-[17px] leading-relaxed text-black/60">
            Transparency, privacy, and encryption are built into every transaction.
          </p>
        </header>

        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-4">
          {claims.map((claim, index) => (
            <SecurityCard key={claim.title} claim={claim} index={index} />
          ))}
        </div>

        {showTribuneBanner ? (
          <aside className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-g-1 border border-[#002fa7]/20 bg-[#ccdaff] px-6 py-4 xl:mt-[70px]">
            <div>
              <h3 className="mb-1 text-[18px] font-normal leading-7 text-black">
                Why the Nigerian Tribune is Talking About Glass
              </h3>
              <p className="text-[16px] leading-6 text-black/60">
                Discover how Glass is redefining community finances.
              </p>
            </div>
            <a
              href="https://tribuneonlineng.com/team-glass-shines-as-winner-of-5th-babcock-innovation-challenge/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[50px] shrink-0 items-center justify-center rounded-g-1 border border-black px-6 py-3 text-[16px] font-medium leading-6 text-brand no-underline transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Read Full Story
            </a>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
