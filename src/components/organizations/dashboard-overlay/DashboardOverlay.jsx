import { useEffect, useRef, useState } from "react";
import { TOASTS, ELEM_IDS, PBARS, NAV_POINTS } from "./constants";
import NavRail from "./NavRail";
import SidebarNav from "./SidebarNav";
import TopBar from "./TopBar";
import TourCursor from "./TourCursor";
import DashboardScreen from "./DashboardScreen";
import PaymentsScreen from "./PaymentsScreen";
import MembersScreen from "./MembersScreen";

// ─── Animated dashboard ───────────────────────────────────────────────────────
// Purely a marketing demo. Guided-tour state (nav/cursor/ring) drives a fake
// cursor clicking through the sidebar the way the real desktop app
// navigates — sidebar and topbar persist, only the content pane's screen
// swaps. Every "dbo-*" element (spread across StatsRow/PaymentPlansPanel/
// RecentActivityPanel/DashboardScreen's header) is additionally driven
// imperatively by document.getElementById from the effect below rather than
// React state, so the reveal timeline can run as a plain async loop instead
// of juggling twelve pieces of animation state through re-renders.
export default function DashboardOverlay() {
  const outerRef = useRef(null);
  const toastRef = useRef(null);
  const aliveRef = useRef(true);
  const [nav, setNav] = useState("dashboard");
  const [cursor, setCursor] = useState({ x: 550, y: 300, visible: false });
  const [ring, setRing] = useState(null);

  useEffect(() => {
    const canvas = document.getElementById("hero-static-canvas");
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

  useEffect(() => {
    aliveRef.current = true;
    const sw = (ms) => new Promise((r) => setTimeout(r, ms));
    const $ = (id) => document.getElementById("dbo-" + id);

    const setRi = (el, show) => {
      if (!el) return;
      el.style.opacity = show ? "1" : "0";
      el.style.transform = show ? "translateY(0)" : "translateY(10px)";
    };

    const resetAll = () => {
      ELEM_IDS.forEach((id) => {
        const el = $(id);
        if (!el) return;
        el.style.transition = "opacity .36s ease, transform .36s ease";
        setRi(el, false);
      });
      PBARS.forEach((p) => {
        const el = $(p.id);
        if (el) {
          el.style.transition = "none";
          el.style.width = "0";
        }
      });
    };

    const revealIn = async () => {
      for (let i = 0; i < ELEM_IDS.length; i++) {
        if (!aliveRef.current) return;
        await sw(i === 0 ? 0 : i < 5 ? 100 : 130);
        const el = $(ELEM_IDS[i]);
        if (!el) continue;
        el.style.transition =
          "opacity .5s cubic-bezier(.22,1,.36,1), transform .5s cubic-bezier(.22,1,.36,1)";
        setRi(el, true);
        if (i >= 6 && i <= 7) {
          const bar = $(PBARS[i - 6].id);
          if (bar) {
            await sw(60);
            bar.style.transition = "width 1.1s ease";
            bar.style.width = PBARS[i - 6].w;
          }
        }
      }
    };

    const revealOut = async () => {
      for (let i = ELEM_IDS.length - 1; i >= 0; i--) {
        if (!aliveRef.current) return;
        await sw(55);
        const el = $(ELEM_IDS[i]);
        if (!el) continue;
        el.style.transition = "opacity .22s ease, transform .22s ease";
        setRi(el, false);
      }
      await sw(320);
    };

    const mkToast = (d) => {
      const el = document.createElement("div");
      el.style.cssText = `
        background:#fff;border-radius:10px;padding:11px 14px;
        box-shadow:0 4px 22px rgba(0,20,80,0.22);border:1px solid #eef0f8;
        display:flex;align-items:flex-start;gap:9px;width:220px;
        opacity:0;transform:translateX(14px);
        transition:opacity .4s ease,transform .4s ease;
        font-family:Inter,-apple-system,sans-serif;
      `;
      el.innerHTML = `
        <div style="width:7px;height:7px;border-radius:50%;background:${d.color};flex-shrink:0;margin-top:4px"></div>
        <div>
          <div style="font-size:11px;font-weight:700;color:#0f1d6e;margin-bottom:2px">${d.title}</div>
          <div style="font-size:10px;color:#6b7280;line-height:1.35">${d.sub}</div>
        </div>`;
      return el;
    };

    const toastLoop = async () => {
      let idx = 0;
      while (aliveRef.current) {
        if (!toastRef.current) {
          await sw(500);
          continue;
        }
        toastRef.current.innerHTML = "";
        const el = mkToast(TOASTS[idx % TOASTS.length]);
        toastRef.current.appendChild(el);
        await sw(40);
        if (!aliveRef.current) return;
        el.style.opacity = "1";
        el.style.transform = "translateX(0)";
        await sw(3500);
        if (!aliveRef.current) return;
        el.style.opacity = "0";
        el.style.transform = "translateX(14px)";
        await sw(500);
        if (el.parentNode) el.parentNode.removeChild(el);
        idx++;
        const gap = idx % 2 === 0 ? 5000 : 7000;
        await sw(gap);
      }
    };

    const move = (p) => {
      if (!aliveRef.current) return;
      setCursor({ x: p.x, y: p.y, visible: true });
    };
    const clickFx = (p) => {
      if (!aliveRef.current) return;
      setRing({ x: p.x, y: p.y, key: Date.now() });
    };

    // One tour lap: dashboard reveals element-by-element (the original
    // animation), then the cursor walks the sidebar — Payments, Members,
    // back to Dashboard — with the content pane sliding between screens.
    const tourLoop = async () => {
      while (aliveRef.current) {
        await revealIn();
        await sw(2400);
        if (!aliveRef.current) break;
        move(NAV_POINTS.payments);
        await sw(1000);
        clickFx(NAV_POINTS.payments);
        await sw(320);
        if (!aliveRef.current) break;
        setNav("payments");
        await sw(4300);
        move(NAV_POINTS.members);
        await sw(1000);
        clickFx(NAV_POINTS.members);
        await sw(320);
        if (!aliveRef.current) break;
        setNav("members");
        await sw(4300);
        move(NAV_POINTS.dashboard);
        await sw(1000);
        clickFx(NAV_POINTS.dashboard);
        await sw(320);
        if (!aliveRef.current) break;
        setNav("dashboard");
        await sw(3000);
        setCursor((c) => ({ ...c, visible: false }));
        await sw(600);
        if (!aliveRef.current) break;
        await revealOut();
        await sw(400);
        resetAll();
      }
    };

    const main = async () => {
      await sw(400);
      if (!aliveRef.current || !outerRef.current) return;
      outerRef.current.style.opacity = "1";
      outerRef.current.style.transform = "translateY(0)";
      await sw(2200);
      if (!aliveRef.current) return;
      tourLoop();
      await sw(1400);
      if (!aliveRef.current) return;
      toastLoop();
    };

    resetAll();
    main();
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const F = { fontFamily: "Inter,-apple-system,sans-serif" };

  return (
    <div className="dashboard-overlay" style={{ position: "relative", width: "100%", ...F }}>
      <style>{`
        .dashboard-frame { padding: 14px 14px 0; border-radius: 16px; }
        .dashboard-window { min-height: 480px; }
        .dashboard-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .dashboard-content { position: relative; flex: 1; min-height: 0; padding: 14px 16px 0; overflow: hidden; }
        .dashboard-tour-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
        .dashboard-tour-actions { display: flex; gap: 7px; }
        .dashboard-home-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .dashboard-stat-row { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-bottom: 12px; }
        .dashboard-tour-screen { position: absolute; inset: 0; overflow: hidden; }
        .dashboard-tour-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-bottom: 10px; }
        .dashboard-plan-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .dashboard-members-table { min-width: 0; }
        .dashboard-members-table-row { grid-template-columns: minmax(22px, .15fr) minmax(90px, 1.5fr) minmax(35px, .5fr) minmax(65px, .9fr) minmax(78px, 1.1fr) minmax(110px, 1.6fr) minmax(18px, .25fr) !important; }
        .dashboard-toast { right: -30px; }
        @media (max-width: 850px) {
          .dashboard-overlay .dashboard-frame { padding: 8px 8px 0 !important; border-radius: 12px !important; }
          .dashboard-overlay .dashboard-window { min-height: 0 !important; flex-direction: column; }
          .dashboard-overlay .dashboard-nav-rail,
          .dashboard-overlay .dashboard-sidebar,
          .dashboard-overlay .dashboard-tour-cursor,
          .dashboard-overlay .dashboard-toast { display: none !important; }
          .dashboard-overlay .dashboard-main { width: 100%; }
          .dashboard-overlay .dashboard-topbar { padding: 8px 10px !important; gap: 8px; }
          .dashboard-overlay .dashboard-search { min-width: 0; padding: 6px 8px !important; }
          .dashboard-overlay .dashboard-search span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .dashboard-overlay .dashboard-content { flex: none; height: 860px; padding: 10px 8px 0 !important; overflow: hidden !important; }
          .dashboard-overlay .dashboard-tour-header { flex-direction: column; gap: 8px; }
          .dashboard-overlay .dashboard-tour-actions { flex-wrap: wrap; }
          .dashboard-overlay .dashboard-due-banner { align-items: flex-start !important; flex-wrap: wrap; padding: 10px !important; }
          .dashboard-overlay .dashboard-due-banner > div:last-child { margin-left: auto; }
          .dashboard-overlay .dashboard-home-panels { grid-template-columns: minmax(0, 1fr) !important; }
          .dashboard-overlay .dashboard-stat-row,
          .dashboard-overlay .dashboard-tour-stats { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .dashboard-overlay .dashboard-tour-screen { overflow-y: auto !important; padding: 10px 8px 0 !important; }
          .dashboard-overlay .dashboard-plan-grid { grid-template-columns: minmax(0, 1fr); }
          .dashboard-overlay .dashboard-tour-screen > div:first-child button { max-width: 100%; }
          .dashboard-overlay .dashboard-members-table { overflow-x: auto; }
          .dashboard-overlay .dashboard-members-table-row { min-width: 520px; }
        }
        @media (max-width: 600px) {
          .dashboard-overlay .dashboard-content { height: 700px; }
          .dashboard-overlay .dashboard-home-panels > :last-child { display: none; }
        }
      `}</style>
      <div
        ref={toastRef}
        className="dashboard-toast"
        style={{
          position: "absolute",
          top: 90,
          right: -30,
          display: "flex",
          flexDirection: "column",
          pointerEvents: "none",
          zIndex: 200,
          width: 220,
        }}
      />
      <div
        ref={outerRef}
        style={{
          opacity: 0,
          transform: "translateY(180px)",
          transition:
            "opacity 2s cubic-bezier(.22,1,.36,1), transform 2s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div
          className="dashboard-frame"
          style={{
            background: "#3a3a3a",
            boxShadow: "0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="dashboard-window"
            style={{
              position: "relative",
              display: "flex",
              background: "#F7F8FC",
              overflow: "hidden",
              borderRadius: "4px 4px 0 0",
            }}
          >
            <style>{`@keyframes gh-click { 0% { transform: scale(0.35); opacity: 0.9; } 100% { transform: scale(1.9); opacity: 0; } }`}</style>
            <div className="dashboard-tour-cursor">
              <TourCursor cursor={cursor} ring={ring} />
            </div>

            <NavRail />
            <SidebarNav nav={nav} />

            <div className="dashboard-main">
              <TopBar />
              <div className="dashboard-content">
                <DashboardScreen />
                <PaymentsScreen active={nav === "payments"} />
                <MembersScreen active={nav === "members"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
