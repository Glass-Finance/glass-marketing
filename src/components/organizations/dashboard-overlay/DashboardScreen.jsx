import StatsRow from "./StatsRow";
import PaymentPlansPanel from "./PaymentPlansPanel";
import RecentActivityPanel from "./RecentActivityPanel";

function PayDuesBanner() {
  return (
    <div
      className="dashboard-due-banner"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 8,
        marginBottom: 12,
        background: "#D7E2FF",
        border: "1px solid #BFD3FF",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <path d="M12 3l10 18H2L12 3z" stroke="#002FA7" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M12 10v4" stroke="#002FA7" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="17" r="0.9" fill="#002FA7" />
        </svg>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1e293b" }}>
            Your School Fees Support payment is due in 3 days
          </div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
            ₦5,000 due Apr 1, 2025 ·{" "}
            <span style={{ color: "#002FA7", fontWeight: 600 }}>Auto-Pay is off</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #002FA7",
            color: "#002FA7",
            fontSize: 10.5,
            fontWeight: 600,
          }}
        >
          Pay Now
        </span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="#002FA7" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

// Base "Dashboard" tour screen — sits in normal flow underneath the
// Payments/Members overlays, which slide in on top of it absolutely
// positioned within the same relative content container.
export default function DashboardScreen() {
  return (
    <>
      <div
        id="dbo-e0"
        className="dashboard-tour-header"
        style={{
          opacity: 0,
          transform: "translateY(10px)",
          transition: "opacity .5s ease, transform .5s ease",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#000" }}>Dashboard</div>
          <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 3 }}>
            A full picture of your community's financial activity.
          </div>
        </div>
        <div className="dashboard-tour-actions" style={{ display: "flex", gap: 7 }}>
          <button
            tabIndex={-1}
            aria-hidden="true"
            style={{
              padding: "6px 12px",
              borderRadius: 7,
              border: "1.5px solid #E0E0EB",
              background: "#fff",
              color: "#000",
              fontSize: 10.5,
              fontWeight: 600,
            }}
          >
            Create Payment Plan
          </button>
          <button
            tabIndex={-1}
            aria-hidden="true"
            style={{
              padding: "6px 12px",
              borderRadius: 7,
              border: "none",
              background: "#002FA7",
              color: "#fff",
              fontSize: 10.5,
              fontWeight: 600,
            }}
          >
            + Add Member
          </button>
        </div>
      </div>

      <PayDuesBanner />

      <StatsRow />

      <div
        className="dashboard-home-panels"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
      >
        <PaymentPlansPanel />
        <RecentActivityPanel />
      </div>
    </>
  );
}
