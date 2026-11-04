function WalletIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-4a2 2 0 0 1 0-4h4z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChecklistIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 11l3 3 8-8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M12 7v5l3.5 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function XCircleIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M9.5 9.5l5 5m0-5l-5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// Matches the real Payments tab's exact StatCard set/order/colors:
// brand / success / amber / danger.
const STATS = [
  {
    label: "Total Amount Collected",
    value: "₦4,800,040",
    small: true,
    fg: "#002FA7",
    bg: "#e6eeff",
    Icon: WalletIcon,
  },
  { label: "Active Plans", value: "04", fg: "#008000", bg: "#DCFCE7", Icon: ChecklistIcon },
  { label: "Yet to pay", value: "36", fg: "#b45309", bg: "#FFF8E7", Icon: ClockIcon },
  { label: "Failed Payments", value: "08", fg: "#db0000", bg: "#FEE2E2", Icon: XCircleIcon },
];

// Frequency pill is always purple in the real app, not color-varying by
// frequency. Status colors match the real PLAN_STATUS map exactly --
// Paused is amber, not gray. Progress-bar color cycles by position
// (BAR_COLOR_CLASSES), same palette as the Dashboard's Payment Plans panel.
const STATUS = {
  Active: { fg: "#008000", bg: "#ecfdf5" },
  Inactive: { fg: "#db0000", bg: "#fff1f2" },
  Paused: { fg: "#b45309", bg: "#fffbeb" },
};
const BAR_COLORS = ["#d4a017", "#6b2fb5", "#002FA7", "#008000"];

const PLANS = [
  {
    st: "Active",
    name: "Association Dues",
    freq: "Monthly",
    amt: "₦5,000",
    collected: "₦1.2M",
    expected: "₦2M",
    pct: "60%",
    due: "Due Apr 1",
  },
  {
    st: "Active",
    name: "Infrastructure Development",
    freq: "One-Time",
    amt: "₦300,000",
    collected: "₦222,000",
    expected: "₦300,000",
    pct: "74%",
    due: "Due Apr 15",
  },
  {
    st: "Inactive",
    name: "End Of The Year Party",
    freq: "One-Time",
    amt: "₦400,500",
    collected: "₦400,500",
    expected: "₦400,500",
    pct: "100%",
    due: "Closed",
  },
  {
    st: "Paused",
    name: "Association Dues",
    freq: "Weekly",
    amt: "₦2,000",
    collected: "₦45,000",
    expected: "₦100,000",
    pct: "45%",
    due: "Due Apr 8",
  },
];

// Tour overlay — slides over the dashboard content pane only (sidebar/topbar
// persist like the real app). `active` = the guided tour is on this screen.
export default function PaymentsScreen({ active }) {
  return (
    <div
      className="dashboard-tour-screen"
      style={{
        position: "absolute",
        inset: 0,
        background: "#F7F8FC",
        padding: "14px 16px 0",
        transform: active ? "translateX(0)" : "translateX(105%)",
        transition: "transform 480ms cubic-bezier(0.32,0.72,0.3,1)",
        boxShadow: "-24px 0 48px rgba(0,0,0,0.14)",
        willChange: "transform",
        overflow: "hidden",
      }}
    >
      <div
        className="dashboard-tour-header"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#000" }}>Payments</div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
            A full picture of all payments created in your community.
          </div>
        </div>
        <button
          tabIndex={-1}
          aria-hidden="true"
          style={{
            padding: "6px 12px",
            borderRadius: 7,
            border: "none",
            background: "#002FA7",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          + Create Payment Plan
        </button>
      </div>
      <div
        className="dashboard-tour-stats"
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "10px 12px",
              border: "1px solid #E0E0EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 9, color: "#9ca3af", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: s.small ? 12 : 14, fontWeight: 700, color: "#000" }}>
                {s.value}
              </div>
            </div>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <s.Icon color={s.fg} />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "inline-flex",
          background: "#F3F4F6",
          borderRadius: 8,
          padding: 2,
          marginBottom: 10,
        }}
      >
        {["All Plans", "Recurring", "One Time"].map((t, i) => (
          <span
            key={t}
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: 6,
              background: i === 0 ? "#fff" : "transparent",
              color: i === 0 ? "#000" : "#6b7280",
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div
        className="dashboard-plan-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
      >
        {PLANS.map((p, i) => {
          const s = STATUS[p.st];
          return (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #E0E0EB",
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: s.fg,
                    background: s.bg,
                    borderRadius: 99,
                    padding: "2px 8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.fg }} />
                  {p.st}
                </span>
                <span style={{ fontSize: 12, color: "#9ca3af", letterSpacing: 1 }}>•••</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#000", marginBottom: 4 }}>
                {p.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: "#000" }}>
                  {p.amt}
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#6b2fb5",
                      background: "#f3eeff",
                      borderRadius: 99,
                      padding: "1px 7px",
                      marginLeft: 4,
                    }}
                  >
                    {p.freq}
                  </span>
                </span>
                <span style={{ fontSize: 9, color: "#9ca3af" }}>
                  <b style={{ color: "#000" }}>{p.collected}</b>/{p.expected} Collected
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  borderRadius: 99,
                  background: "#E0E0EB",
                  overflow: "hidden",
                  marginBottom: 5,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: p.pct,
                    borderRadius: 99,
                    background: BAR_COLORS[i % BAR_COLORS.length],
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 9,
                  color: "#9ca3af",
                }}
              >
                <span>
                  <b style={{ color: "#374151" }}>24 / 120</b> members paid
                </span>
                <span>{p.due}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
