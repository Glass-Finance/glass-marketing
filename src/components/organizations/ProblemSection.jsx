/**
 * Organizations "Problem" section — the scripted payment-tracing story.
 *
 * One ₦25,000 dues payment is followed across five scenes (group chat, bank
 * SMS, counting by hand, a spreadsheet, the member asking where it went) on
 * the purple ProblemStoryBackdrop card, as in the Figma.
 *
 * The phones are rebuilt from the individual Figma exports in
 * src/assets/problem and each layer pops in on a timeline, the way the
 * original scripted version typed its messages. The laptop keeps its single
 * image and reveals the table one row at a time.
 *
 * Phone: phone-frame.png is the Figma phone (273 × 564) with the screen area
 * made transparent. The screen (252 × 541, at x 10 / y 12) is built underneath
 * it, so the real bezel, corners and buttons sit on top. Chat: status bar 44 +
 * chat-header 44 + thread + bottom-bar 66.
 *
 * Everything is driven through `data-role` hooks scoped to this component's
 * root, so it can't collide with the member problem section.
 */

import { useEffect, useRef } from "react";
import { Clock3, Eye } from "lucide-react";
import { cldUrl } from "../../lib/cloudinary";
import ProblemStoryBackdrop from "../ProblemStoryBackdrop";
import laptopSheet from "../../assets/problem/laptop-sheet.svg";
// The Figma phone with its screen cut out (transparent), so layers show through.
import phoneFrame from "../../assets/problem/phone-frame.png";

/* Every file in src/assets/problem, looked up by file name. A name that does
   not exist resolves to undefined and that layer is simply skipped, so a
   mistyped name can't crash the section. */
const ASSETS = import.meta.glob("../../assets/problem/*.{png,svg,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});
const asset = (name) => ASSETS[`../../assets/problem/${name}`];

const photo = (name, width) => {
  const hit = Object.entries(ASSETS).find(([path]) => path.includes(`/${name}.`));
  return hit ? hit[1] : cldUrl(`glass/problem/${name}`, { width });
};

// Layers pop in with the shared `gps-pop` animation and never shrink.
const POP = "flex-none animate-[var(--animate-gps-pop)]";

/* ── What pops into each phone, in order ──────────────────────────────────
   `file` is an image in src/assets/problem; `html()` builds a bubble that has
   no export of its own. `cls` positions the layer, `gap` is the pause (ms)
   before the NEXT layer arrives. */
const CHAT_POP = [
  // Today pill, 102×24 — the Figma places it left of centre.
  { file: "chat-today-pill.svg", cls: "self-start ml-[55px]", gap: 700 },
  // Admin message, 192×213, positioned as in chat-thread.svg.
  { file: "admin-bubble.svg", cls: "self-start ml-[36px]", gap: 1500 },
  // Chidi's receipt card: white card, blue sender name, receipt-card.svg.
  {
    html: () => `
      <div class="${POP} self-start ml-[20px] w-[200px] overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_#0002]">
        <div class="px-3 pt-2.5 text-[13px] leading-none font-medium text-[#5560d8]">Chidi</div>
        <img src="${asset("receipt-card.svg") ?? ""}" alt="" draggable="false" class="block h-auto w-full">
      </div>`,
    gap: 1800,
  },
];

/* The first SMS alert has no export (the sms-credit-alert file is the second,
   cropped one), so it is drawn as text in the same bubble. */
const SMS_ALERT_1 = `
  <div class="${POP} self-start ml-4 w-[206px] rounded-[18px] bg-[#e9e9eb] px-3.5 py-3 text-[13.5px] leading-[21px] text-black">
    Credit Alert!<br>Acc#: ********548<br>Amt: 5,000.00<br>Desc: TRF FROM J NGOZI/<br>MAR<br>NIP/MOB/0813****/DUES<br>Avail Bal: 1,309,512.40
    <div class="mt-1 text-[11px] leading-none text-[#8a8a8e]">7:05PM . SIM 1</div>
  </div>`;

const SMS_POP = [
  { file: "sms-yesterday-label.svg", cls: "self-center", gap: 600 },
  { html: () => SMS_ALERT_1, gap: 1500 },
  { file: "sms-today-label.svg", cls: "self-center", gap: 800 },
  // Second alert, 206×87 — already cropped by the Figma, clipped by the input.
  { file: "sms-credit-alert.svg", cls: "self-start ml-4", gap: 1400 },
];

/* Laptop table rows, measured on the 540×540 export: [top, bottom] in px.
   Header row first, then the four members. */
const SHEET_ROWS = [
  [178, 203],
  [203, 231],
  [231, 259],
  [259, 287],
  [287, 315],
];

// Every scene shares this shell: stacked absolutely, hidden until `.on`,
// sliding in from the right with a clip-path wipe.
const SCENE =
  "scene absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 max-[760px]:px-3 max-[760px]:py-4 invisible translate-x-10 [clip-path:inset(0_0_0_100%)] transition-[clip-path,transform,visibility] duration-750 [&.on]:visible [&.on]:translate-x-0 [&.on]:[clip-path:inset(0)] [&.on]:delay-0";

// The callout card that wipes in beside a device (or under it on phones).
const NOTE_WRAP =
  "flex items-center [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-700 [&.show]:[clip-path:inset(0)] max-[760px]:flex-col max-[760px]:items-center";
const NOTE_LINE =
  "w-[46px] flex-none border-t-2 border-dashed border-[#e0ab88] max-[760px]:h-7 max-[760px]:w-auto max-[760px]:border-t-0 max-[760px]:border-l-2";
const NOTE_CARD =
  "max-w-[210px] rounded-lg border-l-4 border-[#e0ab88] bg-white px-4 py-3 text-[15px] leading-[1.35] font-medium text-[#0f1d6e] shadow-[0_8px_24px_#0000001a]";

// Device: fades up when its scene turns on.
const DEVICE =
  "flex-none drop-shadow-[0_28px_40px_#00000040] translate-y-6 opacity-0 transition-[opacity,transform] duration-700 delay-300 [.on_&]:translate-y-0 [.on_&]:opacity-100";

/* On phones the 273×564 device is scaled to 78% so the phone and its note
   both fit in the stage. Tailwind's `scale` is its own CSS property, so it
   doesn't fight the fade-up `translate`. The negative margin removes the
   empty layout space the scale leaves behind (564 × 0.22 ≈ 124px). */
const PHONE = `${DEVICE} relative h-[564px] w-[273px] max-[760px]:origin-top max-[760px]:scale-[0.78] max-[760px]:-mb-[124px]`;
const SCREEN =
  "absolute top-[12px] left-[10px] flex h-[541px] w-[252px] flex-col overflow-hidden rounded-[41px] font-[-apple-system,'SF_Pro_Text',Roboto,'Segoe_UI',system-ui,sans-serif]";
const FRAME = "pointer-events-none absolute inset-0 z-30 block size-full select-none";

const CAPTION_BASE =
  "absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(14,14,16,0.94),rgba(14,14,16,0.62)_50%,transparent)] px-7 pt-[90px] pb-[26px] text-white [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-800 [&.show]:[clip-path:inset(0)] [&.show>em]:translate-y-0";
const KICKER =
  "flex items-center gap-2.5 text-[11.5px] font-semibold tracking-[0.12em] text-[#b9b9c0] uppercase before:w-[26px] before:border-t-2 before:border-[#e0ab88] before:content-['']";
const CAPTION_TEXT =
  "mt-2 block translate-y-[14px] text-[clamp(20px,2.6vw,28px)] leading-[1.2] font-semibold tracking-[-0.02em] not-italic transition-transform delay-250";
const PHOTO =
  "relative h-[480px] w-[min(100%,680px)] overflow-hidden rounded-[20px] shadow-[0_24px_50px_#00000026] max-[1040px]:h-[380px] max-[600px]:h-[300px]";
const PHOTO_IMG =
  "block h-full w-full scale-100 object-cover transition-transform duration-[9s] ease-out [transform-origin:60%_40%] [.zoom_&]:scale-110";

/** iOS status bar: time on the left, signal / wifi / battery on the right. */
function StatusBar({ signal }) {
  return (
    <div className="relative z-10 flex h-11 flex-none items-center justify-between pr-[18px] pl-[29px] text-[16px] leading-none font-semibold text-black">
      <span>9:41</span>
      <span className="flex items-center gap-[5px]">
        {signal && (
          <img src={signal} alt="" draggable="false" className="block h-[11px] w-[17px]" />
        )}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
          <path
            d="M7.5 2.2c1.9 0 3.6.8 4.9 2l.9-.9A9.3 9.3 0 0 0 7.5.9C5.2.9 3 1.8 1.3 3.3l.9.9a7 7 0 0 1 5.3-2Zm0 3.2c1.1 0 2.1.4 2.9 1.1l.9-.9a6.1 6.1 0 0 0-3.8-1.4c-1.4 0-2.8.5-3.8 1.4l.9.9c.8-.7 1.8-1.1 2.9-1.1Zm0 3.1c.4 0 .8.2 1.1.4L7.5 10 6.4 8.9c.3-.2.7-.4 1.1-.4Z"
            fill="#000"
          />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" stroke="#000" opacity=".4" />
          <rect x="2" y="2" width="18" height="8" rx="2" fill="#000" />
          <path d="M23 4v4c.8-.3 1.5-1.1 1.5-2S23.800 4.300 23 4Z" fill="#000" opacity=".5" />
        </svg>
      </span>
    </div>
  );
}

export default function ProblemSection() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    /* Every lookup is scoped to this section. */
    const $ = (role) => root.querySelector(`[data-role="${role}"]`);
    const $$ = (role) => [...root.querySelectorAll(`[data-role="${role}"]`)];

    let R = 0;
    let observer;

    const hide = (role) => $(role)?.classList.remove("show");
    const show = (role) => $(role)?.classList.add("show");
    const restartZoom = (role) => {
      const el = $(role);
      if (!el) return;
      el.classList.remove("zoom");
      void el.offsetWidth; // restart the zoom transition
      el.classList.add("zoom");
    };

    /** Append one layer to a phone's thread; it pops in via CSS. */
    const pushLayer = (boxRole, item) => {
      let markup = "";
      if (item.html) {
        markup = item.html();
      } else {
        const src = asset(item.file);
        if (!src) return false;
        markup = `<img src="${src}" alt="" draggable="false" class="${POP} ${item.cls}">`;
      }
      $(boxRole).insertAdjacentHTML("beforeend", markup);
      return true;
    };

    /** Play a list of layers into a phone, pausing `gap` after each. */
    const playLayers = async (z, boxRole, list) => {
      $(boxRole).innerHTML = "";
      await z(900);
      for (const item of list) {
        if (pushLayer(boxRole, item)) await z(item.gap);
      }
    };

    /* The five scenes, each an async beat. `z` waits, and throws if the
       timeline was superseded meanwhile (unmounted). */
    const SCENES = [
      async function chat(z) {
        hide("chatNote");
        await playLayers(z, "chat", CHAT_POP);
        show("chatNote");
        await z(3000);
      },

      async function alerts(z) {
        hide("smsNote");
        await playLayers(z, "sms", SMS_POP);
        show("smsNote");
        await z(3000);
      },

      async function counting(z) {
        hide("countingCaption");
        restartZoom("countingPhoto");
        await z(1400);
        show("countingCaption");
        await z(3400);
      },

      async function spreadsheet(z) {
        hide("sheetNote");
        const masks = $$("sheetMask");
        masks.forEach((m) => m.classList.remove("open")); // cover the table
        await z(900);
        for (const m of masks) {
          m.classList.add("open"); // header first, then one row at a time
          await z(650);
        }
        await z(500);
        show("sheetNote");
        await z(3200);
      },

      async function asking(z) {
        const caption = $("askCaption");
        const line = $("askLine");
        // Type into the span, never the caption itself — setting the
        // caption's textContent would delete the <em> wrapper (and with it
        // the large type and the slide-up) before the line is ever typed.
        line.textContent = "";
        caption.classList.remove("show");
        restartZoom("askPhoto");
        await z(1400);
        caption.classList.add("show");
        await z(500);
        const text = "Did mine reflect?";
        for (let i = 1; i <= text.length; i++) {
          line.textContent = text.slice(0, i);
          await z(90);
        }
        await z(2200);
      },
    ];

    /** Run scenes from `index` onward; auto-loops back to the start. */
    async function play(index) {
      const run = ++R;
      const wait = (ms) =>
        new Promise((resolve) => {
          setTimeout(resolve, ms);
        }).then(() => {
          if (run !== R) throw 0; // superseded — unwind quietly
        });

      try {
        for (let i = index; i < SCENES.length; i++) {
          $$("scene").forEach((s, k) => s.classList.toggle("on", k === i));
          // Marks the stage so index.css can size it per scene on phones.
          $("stage").dataset.scene = String(i);
          await SCENES[i](wait);
          if (i < SCENES.length - 1) await wait(500);
        }
        await wait(5000);
        play(0);
      } catch {
        /* stopped: component unmounted */
      }
    }

    let started = false;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries, o) => {
          if (entries[0].isIntersecting && !started) {
            started = true;
            play(0);
            o.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      observer.observe($("player"));
    } else {
      play(0);
    }

    return () => {
      R++; // cancel anything in flight
      if (observer) observer.disconnect();
    };
  }, []);

  const signal = asset("icon-signal.svg");
  const chatHeader = asset("chat-header.svg");
  const chatWallpaper = asset("chat-wallpaper.svg");
  const bottomBar = asset("bottom-bar.svg");
  const smsInput = asset("sms-input.svg");
  const plusIcon = asset("icon-plus.svg");

  return (
    <section
      ref={rootRef}
      className="px-4 py-[88px] text-[17px] leading-[1.55] text-[#6b7280] max-[1040px]:py-14"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* ── Header ── */}
        <header className="mx-auto max-w-[900px] text-center">
           <span className="inline-flex items-center border border-brand-deep/25 text-brand-deep text-[13px] font-medium px-5 py-2 rounded-full">
            The Problem
          </span>
          <h2 className="text-[clamp(26px,5vw,58px)] font-bold text-brand-ink leading-[1.15] tracking-[-0.02em] mb-4">
            Monitoring Payments Shouldn&apos;t Be This Hard
          </h2>
          <p className="mx-auto mt-4 max-w-[56ch] text-[clamp(15px,2vw,17px)] leading-[1.7]">
            Without centralized visibility, time is wasted and trust begins to weaken.
          </p>
        </header>

        {/* <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
          <article className="flex items-start gap-4">
            <span className="grid size-12 flex-none place-items-center rounded-full border border-[#ecedf3] bg-white/70 text-[#002fa7] md:size-16">
              <Clock3 aria-hidden="true" size={24} strokeWidth={1.7} />
            </span>
            <div>
              <h3 className="text-[clamp(16px,2vw,24px)] font-semibold leading-[1.35] text-[#001f6e]">
                How much time goes into tracking and confirming payments?
              </h3>
              <p className="mt-1 text-[clamp(12px,1.5vw,18px)] leading-[1.5] text-[#808080]">
                Checking bank alerts and updating spreadsheets takes up valuable time every month.
              </p>
            </div>
          </article>
          <article className="flex items-start gap-4">
            <span className="grid size-12 flex-none place-items-center rounded-full border border-[#ecedf3] bg-white/70 text-[#002fa7] md:size-16">
              <Eye aria-hidden="true" size={24} strokeWidth={1.7} />
            </span>
            <div>
              <h3 className="text-[clamp(16px,2vw,24px)] font-semibold leading-[1.35] text-[#001f6e]">
                Ever struggled to confirm whether a payment was made?
              </h3>
              <p className="mt-1 text-[clamp(12px,1.5vw,18px)] leading-[1.5] text-[#808080]">
                Without clear records, it&apos;s hard to know who paid, what for, and what&apos;s
                outstanding.
              </p>
            </div>
          </article>
        </div> */}

        {/* ── Player ── */}
        <div data-role="player" className="mt-10">
          <div
            data-role="stage"
            className="relative isolate min-h-[640px] overflow-hidden rounded-sm border border-black/10 transition-[min-height] duration-500 max-[1040px]:min-h-[620px] max-[600px]:min-h-[620px]"
          >
            <ProblemStoryBackdrop className="absolute inset-0 rounded-sm" />

            {/* ── Scene 1: group chat ── */}
            <div data-role="scene" className={SCENE}>
              <div className="flex items-center justify-center max-[760px]:flex-col">
                <div
                  className={PHONE}
                  role="img"
                  aria-label="A WhatsApp group chat where the admin lists the dues payable this Friday and a member posts a payment receipt"
                >
                  <div
                    className={`${SCREEN} bg-[#efeae2] bg-cover bg-center`}
                    style={chatWallpaper ? { backgroundImage: `url(${chatWallpaper})` } : undefined}
                  >
                    <div className="flex-none bg-[#f7f7f7]">
                      <StatusBar signal={signal} />
                      {chatHeader && (
                        <img
                          src={chatHeader}
                          alt=""
                          draggable="false"
                          className="block h-11 w-full"
                        />
                      )}
                    </div>
                    {/* Messages stack from the top and are clipped by the bar
                        below, as in the Figma. */}
                    <div
                      data-role="chat"
                      className="flex min-h-0 flex-1 flex-col items-start gap-[11px] overflow-hidden pt-[17px]"
                    />
                    {bottomBar && (
                      <img
                        src={bottomBar}
                        alt=""
                        draggable="false"
                        className="relative z-10 block h-[66px] w-full flex-none"
                      />
                    )}
                  </div>
                  <img src={phoneFrame} alt="" draggable="false" className={FRAME} />
                </div>
                <div data-role="chatNote" className={`mt-[120px] max-[760px]:mt-4 ${NOTE_WRAP}`}>
                  <i className={NOTE_LINE} />
                  <span className={NOTE_CARD}>
                    Everyone says they&apos;ve paid. Who actually did?
                  </span>
                </div>
              </div>
            </div>

            {/* ── Scene 2: bank SMS ── */}
            <div data-role="scene" className={SCENE}>
              <div className="flex items-center justify-center max-[760px]:flex-col">
                <div
                  className={PHONE}
                  role="img"
                  aria-label="Bank credit-alert text messages that show an amount and a sender name but not which member or which due"
                >
                  <div className={`${SCREEN} bg-white`}>
                    {/* Status bar + contact header. */}
                    <div className="flex-none border-b border-[#dcdce0] bg-[#f7f7f8] pb-2">
                      <StatusBar signal={signal} />
                      <div className="relative flex flex-col items-center gap-1">
                        <span className="absolute top-1 left-3 flex items-center gap-1 text-[#007aff]">
                          <svg
                            width="9"
                            height="15"
                            viewBox="0 0 9 15"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M7.500 1.500 1.800 7.500l5.700 6"
                              stroke="#007aff"
                              strokeWidth="2.200"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="rounded-full bg-[#007aff] px-2 py-px text-[12px] leading-[1.35] font-medium text-white">
                            134
                          </span>
                        </span>
                        <span className="grid size-9 place-items-center rounded-full bg-[#a6a6ab]">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="#fff"
                            aria-hidden="true"
                          >
                            <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-3 0-8 1.500-8 4v2h16v-2c0-2.500-5-4-8-4z" />
                          </svg>
                        </span>
                        <span className="text-[12px] leading-none text-black">
                          +234 9850 0045 <span className="text-[#a6a6ab]">›</span>
                        </span>
                      </div>
                    </div>

                    <div
                      data-role="sms"
                      className="flex min-h-0 flex-1 flex-col items-start gap-2.5 overflow-hidden bg-white pt-3"
                    />

                    {/* Input row: + button, message pill, home indicator. */}
                    <div className="relative z-10 flex-none bg-white">
                      <div className="flex items-center gap-2 px-3 pt-1.5">
                        <span className="grid size-[26px] flex-none place-items-center rounded-full bg-[#e5e5ea]">
                          {plusIcon && (
                            <img src={plusIcon} alt="" draggable="false" className="block size-3" />
                          )}
                        </span>
                        {smsInput && (
                          <img
                            src={smsInput}
                            alt=""
                            draggable="false"
                            className="block h-[26px] w-[196px]"
                          />
                        )}
                      </div>
                      <div className="mx-auto mt-2 mb-2 h-1 w-[88px] rounded-full bg-black" />
                    </div>
                  </div>
                  <img src={phoneFrame} alt="" draggable="false" className={FRAME} />
                </div>
                <div data-role="chatNote" className={`mt-[120px] max-[760px]:mt-3 ${NOTE_WRAP}`}>
                  <i className={NOTE_LINE} />
                  <span className={NOTE_CARD}>Who is J Ngozi? Which member? Which due?</span>
                </div>
              </div>
            </div>

            {/* ── Scene 3: counting by hand ── */}
            <div data-role="scene" className={SCENE}>
              <div data-role="countingPhoto" className={PHOTO}>
                <img
                  src={photo("naira-count", 1000)}
                  alt="A man in a market counting a thick bundle of worn naira notes by hand"
                  className={PHOTO_IMG}
                />
                <div data-role="countingCaption" className={CAPTION_BASE}>
                  <small className={KICKER}>Sat · 10:05 AM</small>
                  <em className={CAPTION_TEXT}>Alerts, notes and screenshots, one by one…</em>
                </div>
              </div>
            </div>

            {/* ── Scene 4: the spreadsheet ── */}
            <div data-role="scene" className={SCENE}>
              <div className="flex items-center justify-center max-[760px]:flex-col">
                <div className={`${DEVICE} relative aspect-square w-[680px] max-w-full`}>
                  <img
                    src={laptopSheet}
                    width="540"
                    height="540"
                    alt="A spreadsheet of members, amounts and due names, with payment statuses of Paid, Unpaid and Incomplete"
                    className="block h-full w-full"
                  />
                  {/* White masks sit over the table and lift one row at a time,
                      so the sheet appears to fill in. Positions are the
                      measured row bounds of the 540×540 export, as %. */}
                  {SHEET_ROWS.map(([top, bottom], k) => (
                    <div
                      key={k}
                      data-role="sheetMask"
                      aria-hidden="true"
                      style={{
                        top: `${(top / 540) * 100}%`,
                        height: `${((bottom - top + 1) / 540) * 100}%`,
                      }}
                      className="absolute left-[15.6%] w-[68.8%] bg-white transition-opacity duration-500 [&.open]:opacity-0"
                    />
                  ))}
                </div>
                <div data-role="sheetNote" className={`mt-6 max-[760px]:mt-3 ${NOTE_WRAP}`}>
                  <i className={NOTE_LINE} />
                  <span className={NOTE_CARD}>
                    Paid, unpaid, incomplete… and none of it is proven.
                  </span>
                </div>
              </div>
            </div>

            {/* ── Scene 5: the member asks ── */}
            <div data-role="scene" className={SCENE}>
              <div data-role="askPhoto" className={PHOTO}>
                <img
                  src={photo("member-phone", 1000)}
                  alt="A member looking away from a table while holding his phone"
                  className={PHOTO_IMG}
                />
                <div
                  data-role="askCaption"
                  className={`${CAPTION_BASE} after:ml-1 after:inline-block after:h-[0.95em] after:w-[3px] after:translate-y-[1px] after:bg-[#e0ab88] after:align-[2px] after:animate-[var(--animate-gps-blink)] after:content-['']`}
                >
                  <small className={KICKER}>Member · Chidi, 4B</small>
                  <em className={CAPTION_TEXT}>
                    <span data-role="askLine" />
                  </em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
