import { useEffect, useLayoutEffect, useRef, useState } from "react";

import iphoneImg from "../../assets/hero/phone-demo/iphone.png";
import drawerImg from "../../assets/hero/phone-demo/drawer.png";
import screenTransactionDetails from "../../assets/hero/phone-demo/screen-transaction-details.png";
import screenPaymentSummary from "../../assets/hero/phone-demo/screen-payment-summary.png";
import screenSuccess from "../../assets/hero/phone-demo/screen-success.png";
import screenSettings from "../../assets/hero/phone-demo/screen-settings.png";
import screenAutopay from "../../assets/hero/phone-demo/screen-autopay.png";
import screenManagePayments from "../../assets/hero/phone-demo/screen-manage-payments.png";
import screenProfile from "../../assets/hero/phone-demo/screen-profile.png";
import screenMyCommunities from "../../assets/hero/phone-demo/screen-my-communities.png";
import receiptImg from "../../assets/hero/phone-demo/receipt.png";
import notifPayments from "../../assets/hero/phone-demo/notifications-payments.png";
import notifCommunity from "../../assets/hero/phone-demo/notifications-community.png";
import notifInvites from "../../assets/hero/phone-demo/notifications-invites.png";

// ─────────────────────────────────────────────────────────────────────────────
// "Phone in hand" auto-playing app demo — ported from the design handoff at
// src/assets/design_handoff_phone_hero (glass-waitlist repo) /
// Glasspay Phone Hero.dc.html. High-fidelity per the handoff: timings,
// easings, and the homography corner coordinates below are final, not
// approximations. The home screen is the only hand-built screen; every
// other screen is a real app export (PNG) sliding in as an overlay, exactly
// mirroring how a real phone would push a new screen onto the stack.
// ─────────────────────────────────────────────────────────────────────────────

// Natural size of the hand/phone photo (iphone.png) — the live screen is
// homography-mapped onto this photo's tilted screen quad, so both the photo
// and the corner coordinates below must stay in lockstep; don't resize one
// without recomputing the other.
const PHONE_W = 876;
const PHONE_H = 791;
const SCREEN_W = 393;
const SCREEN_H = 852;
// Four corners of the screen area in the photo, in image pixel coordinates,
// clockwise from top-left: [tlX,tlY, trX,trY, blX,blY, brX,brY].
const CORNERS = [628, 29, 856, 5, 476, 566, 703, 560];

// Standard 4-point projective mapping (basisToPoints / adjugate method) —
// computes the CSS matrix3d() that warps a flat SCREEN_W×SCREEN_H rectangle
// onto the four corners above, so the live screen appears to sit inside the
// photographed phone at its actual tilt/perspective. Ported verbatim from
// the handoff reference; this is pure math, not app-specific logic.
function homography(w, h, c) {
  const adj = (m) => [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3],
  ];
  const mm = (a, b) => {
    const r = [];
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) {
        let s = 0;
        for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j];
        r[3 * i + j] = s;
      }
    return r;
  };
  const mv = (m, v) => [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
  const b2p = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    const m = [x1, x2, x3, y1, y2, y3, 1, 1, 1];
    const v = mv(adj(m), [x4, y4, 1]);
    return mm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
  };
  const s = b2p(0, 0, w, 0, 0, h, w, h);
  const d = b2p(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7]);
  let t = mm(d, adj(s));
  t = t.map((x) => x / t[8]);
  const m3 = [t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]];
  return "matrix3d(" + m3.join(",") + ")";
}

const SCREEN_TRANSFORM = homography(SCREEN_W, SCREEN_H, CORNERS);

// Static demo data for the hand-built home screen and the transaction
// history list — matches the handoff's Home Screen Spec exactly.
const UPCOMING = [
  {
    amount: "₦2,500/month",
    name: "Infrastructure Development",
    due: "Jun 15, 2025",
    badge: "Recurring",
    badgeColor: "#1C2B8A",
    badgeBg: "#E8ECF8",
  },
  {
    amount: "₦8,000",
    name: "School Fees Support",
    due: "Jun 15, 2025",
    badge: "One-time",
    badgeColor: "#9C27B0",
    badgeBg: "#F3E5F5",
  },
  {
    amount: "₦5,000/month",
    name: "Sports Complex Levy",
    due: "Jul 1, 2025",
    badge: "Recurring",
    badgeColor: "#1C2B8A",
    badgeBg: "#E8ECF8",
  },
];
const HISTORY = [
  { description: "Alumni Contribution", date: "May 1, 2025", amount: "₦15,000" },
  { description: "Infrastructure Development", date: "Apr 15, 2025", amount: "₦2,500" },
  { description: "Alumni Contribution", date: "Apr 1, 2025", amount: "₦15,000" },
  { description: "Infrastructure Development", date: "Mar 15, 2025", amount: "₦2,500" },
];

const NAV_SCREENS = [
  { key: "details", src: screenTransactionDetails },
  { key: "summary", src: screenPaymentSummary },
  { key: "success", src: screenSuccess },
  { key: "settings", src: screenSettings },
  { key: "autopay", src: screenAutopay },
  { key: "manage", src: screenManagePayments },
  { key: "profile", src: screenProfile },
  { key: "communities", src: screenMyCommunities },
];

// ─── Home screen (the only hand-built screen) ────────────────────────────────
function HomeScreen({ homeRef, homeScroll }) {
  return (
    <div
      ref={homeRef}
      style={{
        transform: `translateY(${homeScroll}px)`,
        transition: "transform 2.2s cubic-bezier(0.45,0,0.2,1)",
        willChange: "transform",
        background: "#F7F8FC",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px 20px 20px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 15, minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, width: 24 }}>
            <div style={{ height: 2.5, background: "#222", borderRadius: 2 }} />
            <div style={{ height: 2.5, background: "#222", borderRadius: 2 }} />
            <div style={{ height: 2.5, background: "#222", borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "#1C2B8A",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              K
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#111", whiteSpace: "nowrap" }}>
              Kings College Community
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              minWidth: 15,
              height: 15,
              padding: "0 3px",
              borderRadius: 8,
              background: "#EF4444",
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #fff",
              boxSizing: "border-box",
            }}
          >
            2
          </span>
        </div>
      </div>

      {/* Greeting */}
      <div style={{ padding: "4px 20px 20px 20px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, color: "#111", margin: 0 }}>Hi David,</h1>
        <p style={{ fontSize: 13, color: "#888", margin: "3px 0 0 0" }}>
          Here&apos;s Your Community At A Glance
        </p>
      </div>

      {/* Hero card */}
      <div
        style={{
          margin: "0 16px",
          borderRadius: 16,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid #ECEDF3",
          boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            borderTop: "1.5px solid #002fa7",
            borderLeft: "1.5px solid #002fa7",
            borderRight: "1.5px solid #002fa7",
            borderRadius: "16px 16px 0 0",
            padding: "20px 20px 0 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              border: "1px solid #ECEDF3",
              marginBottom: 14,
              padding: "6px 18px",
              borderRadius: 999,
              color: "#374151",
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6b2fb5" }} />
            Recurring
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 6px 0" }}>Next Payment Due</p>
          <p
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#000000",
              letterSpacing: "-1px",
              lineHeight: 1,
              margin: "0 0 14px 0",
            }}
          >
            ₦15,000
          </p>
        </div>
        <div
          style={{
            padding: "0 20px 20px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              background: "#D7E2FF",
              color: "#002fa7",
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            Alumni Contribution
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 18,
              fontSize: 12,
              color: "#9CA3AF",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>Due: June 1, 2025</span>
          </div>
          <div
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 6,
              background: "#002fa7",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Pay Now
          </div>
        </div>
      </div>

      {/* Upcoming payments */}
      <div
        style={{
          margin: "16px 16px 0 16px",
          background: "#F1F2F7",
          borderRadius: 16,
          padding: "16px 16px 4px 16px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Upcoming Payments</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#1C2B8A",
              background: "#E4E7F9",
              borderRadius: 999,
              padding: "1px 7px",
            }}
          >
            3
          </span>
        </div>
        {UPCOMING.map((p) => (
          <div
            key={p.name}
            style={{
              padding: "14px 12px",
              margin: "16px 0",
              borderRadius: 8,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 6 }}>
                {p.amount}
              </div>
              <p style={{ fontSize: 13, color: "#333", margin: "0 0 4px 0" }}>{p.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#999" }}>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#999"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span style={{ fontSize: 12 }}>Due: {p.due}</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 16,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 999,
                  color: p.badgeColor,
                  background: p.badgeBg,
                }}
              >
                {p.badge}
              </span>
              <div
                style={{
                  padding: "7px 16px",
                  borderRadius: 6,
                  border: "1.5px solid #002fa7",
                  background: "#fff",
                  color: "#002fa7",
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Pay Now
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            padding: "4px 0 10px 0",
            fontSize: 13,
            fontWeight: 600,
            color: "#1C2B8A",
            textAlign: "center",
          }}
        >
          View All
        </div>
      </div>

      {/* Payment history */}
      <div
        style={{
          margin: "16px 16px 40px 16px",
          background: "#F1F2F7",
          borderRadius: 16,
          padding: "16px 16px 4px 16px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Payment History</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#002fa7" }}>See All</span>
        </div>
        {HISTORY.map((h, i) => (
          <div
            key={h.description + i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "13px 0",
              borderBottom: "1px solid #E4E5EC",
            }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#111", margin: "0 0 3px 0" }}>
                {h.description}
              </p>
              <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{h.date}</p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{h.amount}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 10px",
                  borderRadius: 999,
                  color: "#008000",
                  background: "#ECFDF5",
                }}
              >
                Success
              </span>
            </div>
          </div>
        ))}
        <div style={{ height: 10 }} />
      </div>
    </div>
  );
}

// ─── The auto-playing phone demo ─────────────────────────────────────────────
export default function PhoneHeroDemo({ className = "" }) {
  const homeElRef = useRef(null);
  const timersRef = useRef([]);
  const aliveRef = useRef(true);
  const [homeScroll, setHomeScroll] = useState(0);
  const [ov, setOv] = useState({
    details: false,
    summary: false,
    success: false,
    settings: false,
    autopay: false,
    manage: false,
    drawer: false,
    receipt: false,
    profile: false,
    communities: false,
    notif: false,
  });
  const [notifTab, setNotifTab] = useState("payments");
  const [tap, setTap] = useState(null);

  useEffect(() => {
    aliveRef.current = true;

    function at(t, fn) {
      timersRef.current.push(
        setTimeout(() => {
          if (aliveRef.current) fn();
        }, t),
      );
    }
    function tapAt(x, y) {
      setTap({ x, y });
      timersRef.current.push(setTimeout(() => aliveRef.current && setTap(null), 650));
    }
    function nav(name, on) {
      setOv((s) => ({ ...s, [name]: on }));
    }

    function loop() {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      // 0. check notifications from the bell
      at(1000, () => tapAt(355, 78));
      at(1450, () => {
        setNotifTab("payments");
        nav("notif", true);
      });
      at(3200, () => {
        tapAt(196, 136);
        setNotifTab("community");
      });
      at(5000, () => {
        tapAt(318, 136);
        setNotifTab("invites");
      });
      at(7300, () => tapAt(40, 68));
      at(7750, () => nav("notif", false));

      // 1. browse home: scroll to bottom, open a history transaction
      at(8500, () => {
        const h = homeElRef.current ? homeElRef.current.scrollHeight : 1600;
        setHomeScroll(-Math.max(0, h - SCREEN_H));
      });
      at(11600, () => tapAt(196, 620));
      at(12100, () => nav("details", true));
      // 1b. share receipt from transaction details
      at(14300, () => tapAt(196, 708));
      at(14800, () => nav("receipt", true));
      at(17600, () => nav("receipt", false));
      at(18400, () => tapAt(40, 62));
      at(18850, () => nav("details", false));

      // 2. back up, pay the due: summary -> success -> receipt
      at(19400, () => setHomeScroll(0));
      at(21900, () => tapAt(196, 430));
      at(22400, () => nav("summary", true));
      at(24600, () => tapAt(196, 545));
      at(25100, () => nav("success", true));
      at(27500, () => tapAt(196, 776));
      at(28000, () => nav("receipt", true));
      at(30800, () => nav("receipt", false));
      at(31600, () => tapAt(196, 706));
      at(32050, () => {
        nav("success", false);
        nav("summary", false);
      });

      // 3. menu -> drawer -> manage payments
      at(33200, () => tapAt(30, 78));
      at(33650, () => nav("drawer", true));
      at(35200, () => tapAt(100, 180));
      at(35700, () => {
        nav("drawer", false);
        nav("manage", true);
      });
      at(38100, () => tapAt(40, 62));
      at(38550, () => nav("manage", false));

      // 4. menu -> drawer -> settings -> profile / my communities / auto-pay
      at(39600, () => tapAt(30, 78));
      at(40050, () => nav("drawer", true));
      at(41600, () => tapAt(72, 236));
      at(42100, () => {
        nav("drawer", false);
        nav("settings", true);
      });
      at(44300, () => tapAt(196, 233));
      at(44800, () => nav("profile", true));
      at(47000, () => tapAt(40, 62));
      at(47450, () => nav("profile", false));
      at(48200, () => tapAt(196, 784));
      at(48700, () => nav("communities", true));
      at(50900, () => tapAt(40, 62));
      at(51350, () => nav("communities", false));
      at(52100, () => tapAt(196, 612));
      at(52600, () => nav("autopay", true));
      at(55000, () => tapAt(40, 62));
      at(55450, () => nav("autopay", false));
      at(56050, () => nav("settings", false));

      at(57300, () => loop());
    }

    loop();
    return () => {
      aliveRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const tx = (on) => (on ? "translateX(0px)" : "translateX(105%)");
  const overlayShadow = "-24px 0 48px rgba(0,0,0,0.14)";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: PHONE_W,
        height: PHONE_H,
        flexShrink: 0,
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <img
        src={iphoneImg}
        alt="Hand holding a phone showing the Glass member app"
        style={{ position: "absolute", inset: 0, width: PHONE_W, height: PHONE_H }}
        draggable={false}
      />

      {/* Live screen, homography-mapped onto the photo's screen quad */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SCREEN_W,
          height: SCREEN_H,
          transformOrigin: "0 0",
          transform: SCREEN_TRANSFORM,
          borderRadius: 56,
          overflow: "hidden",
          background: "#F7F8FC",
        }}
      >
        <HomeScreen homeRef={homeElRef} homeScroll={homeScroll} />

        {/* Side drawer scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,12,30,0.35)",
            opacity: ov.drawer ? 1 : 0,
            transition: "opacity 420ms ease",
            pointerEvents: "none",
          }}
        />
        {/* Side drawer panel */}
        <img
          src={drawerImg}
          alt=""
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 334,
            height: "100%",
            objectFit: "cover",
            objectPosition: "top left",
            background: "#fff",
            transform: ov.drawer ? "translateX(0px)" : "translateX(-105%)",
            transition: "transform 440ms cubic-bezier(0.32,0.72,0.3,1)",
            boxShadow: "24px 0 48px rgba(0,0,0,0.16)",
            willChange: "transform",
          }}
        />

        {/* Navigation overlay screens (real app exports) */}
        {NAV_SCREENS.map(({ key, src }) => (
          <img
            key={key}
            src={src}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              background: "#F7F8FC",
              transform: tx(ov[key]),
              transition: "transform 480ms cubic-bezier(0.32,0.72,0.3,1)",
              boxShadow: overlayShadow,
              willChange: "transform",
            }}
          />
        ))}

        {/* Notification center (bell) with tab crossfade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#F7F8FC",
            transform: tx(ov.notif),
            transition: "transform 480ms cubic-bezier(0.32,0.72,0.3,1)",
            boxShadow: overlayShadow,
            willChange: "transform",
          }}
        >
          <img
            src={notifPayments}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              opacity: notifTab === "payments" ? 1 : 0,
              transition: "opacity 220ms ease",
            }}
          />
          <img
            src={notifCommunity}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              opacity: notifTab === "community" ? 1 : 0,
              transition: "opacity 220ms ease",
            }}
          />
          <img
            src={notifInvites}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              opacity: notifTab === "invites" ? 1 : 0,
              transition: "opacity 220ms ease",
            }}
          />
        </div>

        {/* Receipt sheet (slides up) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#E9EBF2",
            transform: ov.receipt ? "translateY(0px)" : "translateY(105%)",
            transition: "transform 520ms cubic-bezier(0.32,0.72,0.3,1)",
            boxShadow: "0 -24px 48px rgba(0,0,0,0.18)",
            willChange: "transform",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 70,
            boxSizing: "border-box",
          }}
        >
          <img
            src={receiptImg}
            alt=""
            style={{
              width: 361,
              height: "auto",
              borderRadius: 12,
              boxShadow: "0 8px 30px rgba(20,24,60,0.18)",
            }}
          />
        </div>

        {/* Tap indicator */}
        {tap && (
          <div
            style={{
              position: "absolute",
              left: tap.x,
              top: tap.y,
              width: 44,
              height: 44,
              margin: "-22px 0 0 -22px",
              borderRadius: "50%",
              background: "rgba(28,43,138,0.30)",
              border: "2px solid rgba(255,255,255,0.75)",
              animation: "gp-tap 0.6s ease-out forwards",
              pointerEvents: "none",
              zIndex: 20,
            }}
          />
        )}

        {/* Fixed status bar + dynamic island */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 58,
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 11,
              left: "50%",
              transform: "translateX(-50%)",
              width: 125,
              height: 37,
              borderRadius: 20,
              background: "#0A0A0C",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: 20,
              left: 42,
              fontSize: 15,
              fontWeight: 600,
              color: "#111",
            }}
          >
            9:41
          </span>
          <div
            style={{
              position: "absolute",
              top: 24,
              right: 30,
              width: 25,
              height: 12,
              border: "1px solid rgba(0,0,0,0.4)",
              borderRadius: 4,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "2px 6px 2px 2px",
                background: "#111",
                borderRadius: 1.5,
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gp-tap {
          0% { transform: scale(0.4); opacity: 0; }
          30% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Scaled wrapper ───────────────────────────────────────────────────────────
// PhoneHeroDemo's internals are all fixed-pixel (876×791, matched exactly to
// the homography corner coordinates) — same "render at natural size, scale
// the whole thing down to fit" approach, so it drops into whatever width the
// desktop/mobile hero layout gives it without distorting its internal layout.
export function ScaledPhoneHeroDemo({ maxWidth, className = "" }) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function measure() {
      if (!outerRef.current) return;
      const containerWidth = outerRef.current.offsetWidth;
      if (containerWidth > 0) setScale(containerWidth / PHONE_W);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={outerRef}
      className={className}
      style={{ width: "100%", maxWidth, overflow: "hidden", height: PHONE_H * scale }}
    >
      <div style={{ width: PHONE_W, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <PhoneHeroDemo />
      </div>
    </div>
  );
}
