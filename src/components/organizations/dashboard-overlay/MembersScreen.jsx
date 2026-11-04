function UsersIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.8" />
      <path
        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function UserCheckIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="8.5" cy="7" r="4" stroke={color} strokeWidth="1.8" />
      <path
        d="M17 11l2 2 4-4"
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
function ShieldIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Matches the real Members tab's exact StatCard set/order/colors: brand /
// success / amber / purple.
const STATS = [
  { label: "Total Members", value: "209", fg: "#002FA7", bg: "#e6eeff", Icon: UsersIcon },
  { label: "Active Members", value: "197", fg: "#008000", bg: "#DCFCE7", Icon: UserCheckIcon },
  { label: "Inactive", value: "12", fg: "#b45309", bg: "#FFF8E7", Icon: ClockIcon },
  { label: "Admins", value: "02", fg: "#6b2fb5", bg: "#F3EEFF", Icon: ShieldIcon },
];

const MEMBERS = [
  {
    n: "Adebayor Okafor",
    plans: "2",
    st: "2/2 Paid",
    sc: "#008000",
    sb: "#ecfdf5",
    d: "Mar 12, 2025",
    e: "adebayor@gmail.com",
  },
  {
    n: "Chisom Eze",
    plans: "2",
    st: "1/2 Paid",
    sc: "#b45309",
    sb: "#fffbeb",
    d: "Mar 12, 2025",
    e: "chisom@gmail.com",
  },
  {
    n: "Tunde Nwosu",
    plans: "3",
    st: "0/3 Paid",
    sc: "#db0000",
    sb: "#fff1f2",
    d: "Mar 12, 2025",
    e: "tunde@gmail.com",
  },
  {
    n: "Blessing Igwe",
    plans: "2",
    st: "2/2 Paid",
    sc: "#008000",
    sb: "#ecfdf5",
    d: "Mar 12, 2025",
    e: "blessing@gmail.com",
  },
];

const COLS = "22px 1.5fr 0.5fr 0.9fr 1.1fr 1.6fr 0.6fr";

// Tour overlay — slides over the dashboard content pane only (sidebar/topbar
// persist like the real app). `active` = the guided tour is on this screen.
export default function MembersScreen({ active }) {
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
          <div style={{ fontSize: 16, fontWeight: 800, color: "#000" }}>Members</div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
            A full picture of the members of your community
          </div>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <button
            tabIndex={-1}
            aria-hidden="true"
            style={{
              padding: "6px 12px",
              borderRadius: 7,
              border: "1.5px solid #E0E0EB",
              background: "#fff",
              color: "#000",
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="12" height="12" rx="2" stroke="#000" strokeWidth="1.8" />
              <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                stroke="#000"
                strokeWidth="1.8"
              />
            </svg>
            Copy Invite Link
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
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            + Add Member
          </button>
        </div>
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
              <div style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>{s.value}</div>
            </div>
            <div
              className="dashboard-members-table"
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
        className="dashboard-members-table-row"
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #E0E0EB",
          padding: "10px 14px 6px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#000" }}>Member Payments</span>
          <button
            tabIndex={-1}
            aria-hidden="true"
            style={{
              padding: "5px 11px",
              borderRadius: 7,
              border: "1.5px solid #E0E0EB",
              background: "#fff",
              color: "#002FA7",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            Export Csv
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              borderRadius: 7,
              padding: "5px 11px",
              border: "1px solid #E0E0EB",
              flex: 1,
              maxWidth: 190,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="1.8" />
              <path
                d="M21 21l-4.35-4.35"
                stroke="#9ca3af"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <span style={{ fontSize: 10, color: "#9ca3af" }}>Search members…</span>
          </div>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "#6b7280",
              border: "1px solid #E0E0EB",
              borderRadius: 6,
              padding: "4px 9px",
            }}
          >
            Filter
          </span>
          <span style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap" }}>
            Sort: <b style={{ color: "#000" }}>Recent</b>
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: COLS,
            gap: 8,
            alignItems: "center",
            padding: "7px 0",
            borderBottom: "1px solid #f3f4f8",
            fontSize: 10,
            color: "#9ca3af",
            fontWeight: 600,
            background: "#F9F9FB",
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: 3, border: "1.5px solid #d1d5db" }} />
          <span>Members</span>
          <span>Plans</span>
          <span>Status</span>
          <span>Date</span>
          <span>Email</span>
          <span></span>
        </div>
        {MEMBERS.map((m, i, arr) => (
          <div
            key={m.n}
            className="dashboard-members-table-row"
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              gap: 8,
              alignItems: "center",
              padding: "9px 0",
              borderBottom: i < arr.length - 1 ? "1px solid #f3f4f8" : "none",
            }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: 3,
                border: "1.5px solid #d1d5db",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#002FA7" }}>{m.n}</span>
            <span style={{ fontSize: 11, color: "#374151" }}>{m.plans}</span>
            <span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: m.sc,
                  background: m.sb,
                  borderRadius: 99,
                  padding: "1px 8px",
                }}
              >
                {m.st}
              </span>
            </span>
            <span style={{ fontSize: 11, color: "#374151" }}>{m.d}</span>
            <span
              style={{
                fontSize: 11,
                color: "#6b7280",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {m.e}
            </span>
            <span style={{ display: "flex", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="#9ca3af"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
