import { useEffect, useRef, useState } from "react";

/* Step timings (ms) per stage — mirrors the PLANS table in the reference HTML. */
const PLANS = {
  fees: [3000, 2600],
  data: [2200, 1800, 2200, 2200],
  enc: [2800, 3400],
};

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789#$@!%&";

/* ── Scene 1: No Hidden Fees ── */
function FeesStage({ step }) {
  return (
    <div className="st-stage" data-stage="fees" data-step={step} aria-hidden="true">
      <div className="st-frame">
        <div className="st-panel" style={{ minHeight: 92 }}>
          <div className={`st-layer st-fees ${step === 0 ? "on" : ""}`} data-on="0">
            <h4>Payment Breakdown</h4>
            <div className="st-row">
              <span>Community dues:</span>
              <b>₦5,000.00</b>
            </div>
            <div className="st-row">
              <span>Transaction Fee:</span>
              <b>₦50.00</b>
            </div>
          </div>
          <div
            className={`st-layer is-abs ${step === 1 ? "on" : ""}`}
            data-on="1"
            style={{ padding: "0 14px" }}
          >
            <div className={`st-toast ${step === 1 ? "on" : ""}`}>
              <i /> Community Receives ₦5,000.00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Scene 2: Data Rights ── */
function DataStage({ step }) {
  return (
    <div className="st-stage" data-stage="data" data-step={step} aria-hidden="true">
      <div className="st-frame">
        <div className="st-panel" style={{ minHeight: 112 }}>
          <div className={`st-layer ${step <= 2 ? "on" : ""}`} data-on="0,1,2">
            <div className="st-person">
              <img
                className="st-avatar"
                src="/profile-2.svg"
                alt=""
                width={44}
                height={44}
                onError={(e) => {
                  e.currentTarget.replaceWith(
                    Object.assign(document.createElement("div"), {
                      className: "st-avatar",
                      textContent: "TA",
                    }),
                  );
                }}
              />
              <div>
                <strong>Tunde Adegbite</strong>
                <small>Member</small>
              </div>
              <div className="st-act">
                <div className="st-more">…</div>
                <div className="st-edit">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16v4zM13.5 6.5l4 4" />
                  </svg>
                  Edit
                </div>
              </div>
            </div>
            <div className="st-rule" />
            <div className="st-field">
              <div className="st-f-phone">
                <small>Phone Number</small>
                <span>0803 000 5678</span>
                <em className="st-badge" style={{ fontStyle: "normal" }}>
                  Updated
                </em>
              </div>
              <div className="st-f-email">
                <small>Email</small>
                <span>sulai**m@gmail.com</span>
              </div>
            </div>
            <div className="st-menu">
              <div>
                <svg viewBox="0 0 24 24">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
                </svg>
                Phone Number
              </div>
              <div>
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                Email
              </div>
            </div>
          </div>
          <div
            className={`st-layer is-abs ${step === 3 ? "on" : ""}`}
            data-on="3"
            style={{ padding: "0 14px" }}
          >
            <div className={`st-toast ${step === 3 ? "on" : ""}`}>
              <i /> Phone Number Updated!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Scene 3: Encryption ── */
function EncStage({ step, scrValues }) {
  return (
    <div className="st-stage" data-stage="enc" data-step={step} aria-hidden="true">
      <div className="st-frame">
        <div className="st-panel st-enc" style={{ minHeight: 112 }}>
          <div className={`st-layer ${step === 0 ? "on" : ""}`} data-on="0">
            <h4>Member Information</h4>
            <div className="st-rule" />
            <span className="st-lbl">Email:</span>
            <span className="st-val">sulai**m@gmail.com</span>
            <span className="st-lbl">Phone Number:</span>
            <span className="st-val">0803 000 5678</span>
          </div>
          <div
            className={`st-layer is-abs ${step === 1 ? "on" : ""}`}
            data-on="1"
            style={{ padding: "12px 14px" }}
          >
            <h4>Protected Information</h4>
            <div className="st-rule" />
            <span className="st-val" style={{ marginTop: 10 }}>
              {scrValues[0]}
            </span>
            <span className="st-val" style={{ marginTop: 10 }}>
              {scrValues[1]}
            </span>
          </div>
          <span className="st-sweep" />
        </div>
      </div>
    </div>
  );
}

/* ── Card wrapper ── */
function StCard({ children, icon, title, description }) {
  return (
    <article className="st-card">
      {children}
      <div className="st-body">
        <svg className="st-icon" viewBox="0 0 24 24" aria-hidden="true">
          {icon}
        </svg>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </article>
  );
}

export default function SecurityCards({ showTribuneBanner = false }) {
  const rootRef = useRef(null);
  const [feesStep, setFeesStep] = useState(0);
  const [dataStep, setDataStep] = useState(0);
  const [encStep, setEncStep] = useState(0);
  const [scrValues, setScrValues] = useState(["a8F#2kP9@zQ4", "X7$mL3!vR0pB"]);
  const timersRef = useRef([]);
  const scrambleRef = useRef([]);

  /* Text-scramble: reveals characters left-to-right over ~22 ticks. */
  const scramble = () => {
    scrambleRef.current.forEach((intervalId) => clearInterval(intervalId));
    scrambleRef.current = ["a8F#2kP9@zQ4", "X7$mL3!vR0pB"].map((fin, k) => {
      let t = 0;
      const total = 22;
      return setInterval(() => {
        t += 1;
        const reveal = Math.floor((Math.max(0, t - 6 - k * 3) / (total - 6)) * fin.length);
        let out = "";
        for (let i = 0; i < fin.length; i++) {
          out += i < reveal ? fin[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setScrValues((prev) => {
          const next = [...prev];
          next[k] = t >= total + k * 3 ? fin : out;
          return next;
        });
        if (t >= total + k * 3) {
          clearInterval(scrambleRef.current[k]);
        }
      }, 45);
    });
  };

  /* Cycle a single stage through its plan, then loop. */
  const runCycle = (plan, setter, onStep) => {
    let i = 0;
    const tick = () => {
      const timer = setTimeout(() => {
        i = (i + 1) % plan.length;
        setter(i);
        if (onStep) onStep(i);
        tick();
      }, plan[i]);
      timersRef.current.push(timer);
    };
    tick();
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    const clearAll = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      scrambleRef.current.forEach(clearInterval);
      scrambleRef.current = [];
    };

    const startAll = () => {
      clearAll();
      setFeesStep(0);
      setDataStep(0);
      setEncStep(0);
      setScrValues(["a8F#2kP9@zQ4", "X7$mL3!vR0pB"]);
      runCycle(PLANS.fees, setFeesStep);
      runCycle(PLANS.data, setDataStep);
      runCycle(PLANS.enc, setEncStep, (i) => {
        if (i === 1) scramble();
      });
    };

    let observer;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startAll();
            observer.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      const firstStage = root.querySelector(".st-stage");
      if (firstStage) observer.observe(firstStage);
    } else {
      startAll();
    }

    return () => {
      clearAll();
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <section ref={rootRef} className="mx-auto max-w-[1240px] px-6 py-[72px] md:py-14" id="security">
      {/* ── Header ── */}
      <header className="text-center">
        <span className="st-pill">Security &amp; Trust</span>
        <h2 className="mx-auto mb-4 mt-7 max-w-[900px] text-[clamp(34px,6vw,64px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0a1a6e]">
          Security for your peace of mind
        </h2>
        <p className="st-sub">
          Clear payment terms, data rights, and encryption for sensitive fields.
        </p>
      </header>

      {/* ── Cards ── */}
      <div className="st-grid">
        <StCard
          icon={
            <>
              <path
                d="M12 5C6.5 5 2.7 9 1.5 12c1.2 3 5 7 10.5 7s9.3-4 10.5-7C21.3 9 17.5 5 12 5z"
                fill="currentColor"
              />
              <circle cx="12" cy="12" r="3.6" fill="#fff" />
              <circle cx="12" cy="12" r="1.8" fill="currentColor" />
            </>
          }
          title="No Hidden Fees"
          description="See every fee upfront. Your community receives the full due."
        >
          <FeesStage step={feesStep} />
        </StCard>

        <StCard
          icon={
            <>
              <path d="M12 2l8 3v6c0 5-3.4 9.2-8 11-4.6-1.8-8-6-8-11V5l8-3z" fill="currentColor" />
              <path
                d="M8.5 12l2.5 2.5 4.5-5"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          }
          title="Data Rights"
          description="Access, correct or request deletion of your data."
        >
          <DataStage step={dataStep} />
        </StCard>

        <StCard
          icon={
            <>
              <rect x="4.5" y="10" width="15" height="11" rx="3" fill="currentColor" />
              <path
                d="M8 10V7.5a4 4 0 018 0V10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="15.5" r="1.5" fill="#fff" />
            </>
          }
          title="Encryption"
          description="All data and transactions are encrypted. Your records are private."
        >
          <EncStage step={encStep} scrValues={scrValues} />
        </StCard>
      </div>

      {/* ── Tribune banner ── */}
      {showTribuneBanner ? (
        <div className="st-banner">
          <div>
            <strong>Why the Nigerian Tribune is Talking About Glass</strong>
            <span>Discover how Glass is redefining community finances.</span>
          </div>
          <a
            className="st-btn"
            href="https://tribuneonlineng.com/team-glass-shines-as-winner-of-5th-babcock-innovation-challenge/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check it Out
          </a>
        </div>
      ) : null}
    </section>
  );
}
