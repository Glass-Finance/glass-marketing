/**
 * Member "Problem" section — one phone, three beats.
 *
 * The Figma shows a single phone on the purple story card, so this replaces
 * the three stacked panels with one persistent phone whose screen changes:
 *
 *   1. Chat: the thread scrolls up and down hunting for the dues details,
 *      then the search field goes from empty → "Account Details" (two Figma
 *      exports, cross-faded) and only THEN "No Result Found" appears.
 *   2. Bank app: home → recipient → amount → review → success. Leaving the
 *      chat to pay means re-typing everything.
 *   3. Chat again: scrolling the thread for proof of an earlier payment.
 *
 * Everything on the phone screen is a layer exported from Figma
 * (src/assets/problem). phone-frame.png is the Figma phone with its screen cut
 * out, laid on top, so the real bezel and corners frame whatever is playing.
 *
 * The timeline is imperative on purpose (scroll the thread, swap bars, step
 * through screens). It drives the DOM through `data-role` hooks scoped to this
 * component's root. Respects prefers-reduced-motion by showing the first state
 * only.
 *
 * Styling is Tailwind-only.
 */

import { useEffect, useRef } from "react";
import ProblemStoryBackdrop from "../ProblemStoryBackdrop";

import phoneFrame from "../../assets/problem/phone-frame.png";
import chatWallpaper from "../../assets/problem/chat-wallpaper.svg";
import chatHeader from "../../assets/problem/chat-header.svg";
import chatToday from "../../assets/problem/chat-today-pill.svg";
import composeBar from "../../assets/problem/bottom-bar.svg";
import iconSignal from "../../assets/problem/icon-signal.svg";
import memberThread from "../../assets/problem/member-thread.svg";
import searchBar from "../../assets/problem/search-bar.svg";
import bankHome from "../../assets/problem/bank-home.svg";
import bankRecipient from "../../assets/problem/bank-recipient.svg";
import bankAmount from "../../assets/problem/bank-amount.svg";
import bankReview from "../../assets/problem/bank-review.svg";
import bankSuccess from "../../assets/problem/bank-success.svg";
import galleryScreen from "../../assets/problem/member-gallery.svg";
import searchFieldEmpty from "../../assets/problem/search-field-empty.svg";
/* NEW — the Figma search field with "Account Details" already in it
   (Frame_2121456065.svg, 189×29). Save it as search-field-filled.svg. */
import searchFieldFilled from "../../assets/problem/search-field-filled.svg";

const HEADLINE = "Paying Dues Shouldn’t Be A Hassle";
const LEDE =
  "From searching group chats for payment details to switching apps and keeping receipts, a simple payment becomes unnecessarily complicated.";

/* The bank app, one screen per step of a transfer. */
const BANK_STEPS = [
  { src: bankHome, alt: "Bank app home with recent transactions" },
  { src: bankRecipient, alt: "Choose recipient: bank, account number and account name" },
  { src: bankAmount, alt: "Enter amount and description" },
  { src: bankReview, alt: "Transfer details to review" },
  { src: bankSuccess, alt: "Transfer successful" },
];

/* The callout beside the phone changes with each beat. */
const NOTES = {
  search: "Dues details get buried. Search finds nothing.",
  bank: "Leave the chat. Open your bank. Type it all again.",
  proof: "Paid last week. Where is the receipt?",
};

/* Phone: the Figma frame (273×564) on top, with the 252×541 screen
   underneath at the frame's cut-out (x 10, y 12). */
const PHONE =
  "relative h-[564px] w-[273px] flex-none drop-shadow-[0_28px_40px_#00000055] translate-y-6 opacity-0 transition-[opacity,transform] duration-700 [&.ready]:translate-y-0 [&.ready]:opacity-100";
const SCREEN =
  "absolute top-[12px] left-[10px] h-[541px] w-[252px] overflow-hidden rounded-[38px] bg-[#f9f9fb]";
const FRAME = "pointer-events-none absolute inset-0 z-30 block size-full select-none";
/* The Figma phone exports are full 273×564 artboards with their own bezel.
   Offset by the screen cut-out (x 10, y 12) and let SCREEN's overflow-hidden
   crop away the bezel — the real frame image sits on top. */
const ARTBOARD =
  "pointer-events-none absolute -top-[12px] -left-[10px] block h-[564px] w-[273px] max-w-none select-none";

/* Callout: wipes in beside the phone on desktop, under it on phones. */
const NOTE_WRAP =
  "absolute top-[120px] left-full flex items-center [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-700 [&.show]:[clip-path:inset(0)] max-[760px]:static max-[760px]:mt-3 max-[760px]:flex-col max-[760px]:items-center";
const NOTE_LINE =
  "w-[46px] flex-none border-t-2 border-dashed border-[#e0ab88] max-[760px]:h-7 max-[760px]:w-auto max-[760px]:border-t-0 max-[760px]:border-l-2";
const NOTE_CARD =
  "w-[210px] rounded-lg border-l-4 border-[#e0ab88] bg-white px-4 py-3 text-[15px] leading-[1.35] font-medium text-[#0f1d6e] shadow-[0_8px_24px_#0000001a]";

/** iOS status bar, matching the one baked into the bank-app exports. */
function StatusBar() {
  return (
    <div className="relative z-10 flex h-11 flex-none items-center justify-between px-[26px] pb-1 text-[14.5px] leading-none font-semibold text-black">
      <span>9:41</span>
      <span className="flex items-center gap-[5px]">
        <img src={iconSignal} alt="" draggable="false" className="block h-[11px] w-[17px]" />
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
          <path
            d="M7.5 2.2c1.9 0 3.6.8 4.9 2l.9-.9A9.3 9.3 0 0 0 7.5.9C5.2.9 3 1.8 1.3 3.3l.9.9a7 7 0 0 1 5.3-2Zm0 3.2c1.1 0 2.1.4 2.9 1.1l.9-.9a6.1 6.1 0 0 0-3.8-1.4c-1.4 0-2.8.5-3.8 1.4l.9.9c.8-.7 1.8-1.1 2.9-1.1Zm0 3.1c.4 0 .8.2 1.1.4L7.5 10 6.4 8.9c.3-.2.7-.4 1.1-.4Z"
            fill="#000"
          />
        </svg>
        <span className="relative grid h-[11px] w-[19px] place-items-center rounded-[3.5px] bg-black text-[7.5px] leading-none font-bold text-white after:absolute after:-right-[2px] after:h-[4px] after:w-[1.5px] after:rounded-r-full after:bg-black/45 after:content-['']">
          73
        </span>
      </span>
    </div>
  );
}

export default function MembersProblem() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    /* Every lookup is scoped to this section. */
    const $ = (role) => root.querySelector(`[data-role="${role}"]`);
    const $$ = (role) => [...root.querySelectorAll(`[data-role="${role}"]`)];

    let R = 0;
    let observer;

    const flag = (role, on) => $(role)?.classList.toggle("on", on);
    const setStep = (k) => $$("bankStep").forEach((el, i) => el.classList.toggle("on", i === k));

    /* Put the search UI back to "closed": no field, no filled text, no result. */
    const resetSearch = () => {
      flag("searchBar", false); // "No Result Found" off first, always
      flag("searchFilled", false);
      flag("searchField", false);
    };

    /* Scroll the chat thread to `y` px over `ms` (0 = jump). */
    const scrollTo = (y, ms) => {
      const track = $("track");
      track.style.transition = ms ? `transform ${ms}ms cubic-bezier(0.45,0,0.2,1)` : "none";
      track.style.transform = `translateY(${-y}px)`;
    };
    const maxScroll = () => Math.max(0, $("track").offsetHeight - $("view").clientHeight);

    /* Hide the callout, swap its text once the wipe has finished, show it. */
    const say = async (z, text) => {
      $("note").classList.remove("show");
      await z(450);
      $("noteText").textContent = text;
      $("note").classList.add("show");
    };

    const SCENES = [
      /* 1 · Hunting through the chat, then a search that finds nothing. */
      async function chat(z) {
        flag("bankScreen", false);
        flag("galleryScreen", false);
        resetSearch();
        $("note").classList.remove("show");
        scrollTo(0, 0);

        await z(1300);
        scrollTo(maxScroll() * 0.5, 1900);
        await z(2200);
        scrollTo(0, 1500);
        await z(1800);

        flag("searchField", true); // 1. empty search bar appears
        await z(1200);
        flag("searchFilled", true); // 2. swaps to the bar with "Account Details"
        await z(1200);
        flag("searchBar", true); // 3. only now: "No Result Found" at the bottom
        await z(1100);
        await say(z, NOTES.search);
        await z(2800);
      },

      /* 2 · Leave the chat and pay in the bank app, one screen at a time. */
      async function bank(z) {
        $("note").classList.remove("show");
        setStep(-1);
        flag("bankScreen", true);
        await z(350);
        for (let k = 0; k < BANK_STEPS.length; k++) {
          setStep(k);
          if (k === 1) await say(z, NOTES.bank);
          await z(1300);
        }
        await z(900);
      },

      /* 3 · Back in the chat, scrolling for proof, then the gallery. */
      async function proof(z) {
        $("note").classList.remove("show");
        flag("bankScreen", false);
        flag("galleryScreen", false);
        await z(600);
        resetSearch();
        scrollTo(0, 0);

        await z(900);
        scrollTo(maxScroll() * 0.62, 2000);
        await z(2300);
        scrollTo(maxScroll(), 1600);
        await z(1900);

        flag("galleryScreen", true);
        await z(1200);
        await say(z, NOTES.proof);
        await z(2800);
        flag("galleryScreen", false);
        await z(600);
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
        $("phone").classList.add("ready");
        for (let i = index; i < SCENES.length; i++) {
          await SCENES[i](wait);
          if (i < SCENES.length - 1) await wait(500);
        }
        await wait(3500);
        play(0);
      } catch {
        /* stopped: component unmounted */
      }
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // First state only: the chat as designed, no autoplay.
      $("phone").classList.add("ready");
      return undefined;
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

  return (
    <section
      ref={rootRef}
      className="relative mx-auto max-w-[1240px] overflow-x-clip px-4 pt-[72px] pb-[88px] font-[Inter,sans-serif] text-[17px] leading-[1.55] max-[1000px]:pt-[56px] max-[1000px]:pb-16"
      id="problem"
    >
      <div className="relative text-center">
        <span className="inline-flex items-center rounded-full border border-brand-deep/25 px-5 py-2 text-[13px] font-medium tracking-[0.02em] text-brand-deep uppercase">
          The Problem
        </span>
        <h2 className="mt-[26px] text-[clamp(26px,5vw,58px)] font-bold leading-[1.15] tracking-[-0.02em] text-balance text-brand-ink">
          {HEADLINE}
        </h2>
        <p className="mx-auto mt-[18px] max-w-[80ch] text-[clamp(15px,2vw,17px)] leading-[1.7] text-black/60">
          {LEDE}
        </p>
      </div>

      {/* ── Player ── */}
      <div data-role="player" className="relative mt-16 max-[1000px]:mt-11">
        <div className="relative isolate flex min-h-[660px] items-center justify-center overflow-hidden rounded-[8px] border border-black/10 py-12 max-[760px]:min-h-[760px]">
          <ProblemStoryBackdrop className="absolute inset-0" />

          <div className="relative z-10 flex flex-col items-center">
            <div
              data-role="phone"
              className={PHONE}
              role="img"
              aria-label="A group chat the member scrolls and searches for payment details, then a bank app they switch to in order to pay, then the chat again while looking for a receipt"
            >
              <div className={SCREEN}>
                {/* Layer 1 — the group chat. */}
                <div
                  data-role="chatScreen"
                  className="absolute inset-0 flex flex-col bg-[#efeae2] bg-cover bg-center font-[-apple-system,'SF_Pro_Text',Roboto,'Segoe_UI',system-ui,sans-serif]"
                  style={{ backgroundImage: `url(${chatWallpaper})` }}
                >
                  <div className="relative flex-none bg-[#f7f7f7]">
                    <StatusBar />
                    <div className="relative h-11">
                      <img
                        src={chatHeader}
                        alt=""
                        draggable="false"
                        className="block h-11 w-full"
                      />
                      {/* Search field: the empty export sits underneath and the
                          "Account Details" export fades in on top of it. No
                          typed text, so nothing can go missing. */}
                      <div
                        data-role="searchField"
                        className="absolute inset-0 flex items-center justify-center bg-[#f7f7f7] opacity-0 transition-opacity duration-300 [&.on]:opacity-100"
                      >
                        <div className="relative h-[29px] w-[189px]">
                          <img
                            src={searchFieldEmpty}
                            alt=""
                            draggable="false"
                            className="absolute inset-0 block h-full w-full max-w-none"
                          />
                          <img
                            data-role="searchFilled"
                            src={searchFieldFilled}
                            alt=""
                            draggable="false"
                            className="absolute inset-0 block h-full w-full max-w-none opacity-0 transition-opacity duration-300 [&.on]:opacity-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* The thread: pill + the exported conversation, moved as one
                      track so scrolling is a single transform. */}
                  <div data-role="view" className="relative min-h-0 flex-1 overflow-hidden">
                    <div data-role="track" className="flex flex-col pt-4 will-change-transform">
                      <img
                        src={chatToday}
                        alt=""
                        draggable="false"
                        className="block h-6 w-[102px] max-w-none flex-none ml-[75px]"
                      />
                      <img
                        src={memberThread}
                        alt=""
                        draggable="false"
                        className="mt-2 ml-[6px] block h-[1195px] w-[240px] max-w-none flex-none"
                      />
                    </div>
                  </div>

                  {/* Compose bar; the search bar ("No Result Found") covers it,
                      but only after the "Account Details" search is showing. */}
                  <div className="relative z-10 h-[66px] flex-none bg-white">
                    <img
                      src={composeBar}
                      alt=""
                      draggable="false"
                      className="absolute inset-0 block h-full w-full"
                    />
                    <img
                      data-role="searchBar"
                      src={searchBar}
                      alt=""
                      draggable="false"
                      className="absolute inset-0 block h-full w-full opacity-0 transition-opacity duration-400 [&.on]:opacity-100"
                    />
                  </div>
                </div>

                {/* Layer 2 — the bank app, one screen at a time. These exports
                    carry their own status bar. */}
                <div
                  data-role="bankScreen"
                  className="pointer-events-none absolute inset-0 z-20 bg-[#f9f9fb] opacity-0 transition-opacity duration-500 [&.on]:opacity-100"
                >
                  {BANK_STEPS.map((step) => (
                    <img
                      key={step.src}
                      data-role="bankStep"
                      src={step.src}
                      alt={step.alt}
                      draggable="false"
                      className="absolute inset-0 block h-full w-full translate-y-2 opacity-0 transition-[opacity,transform] duration-500 [&.on]:translate-y-0 [&.on]:opacity-100"
                    />
                  ))}
                </div>

                {/* Layer 3 — photo gallery (member-gallery.svg) */}
                <div
                  data-role="galleryScreen"
                  className="pointer-events-none absolute inset-0 z-20 overflow-hidden bg-black opacity-0 transition-opacity duration-500 [&.on]:opacity-100"
                >
                  <img
                    src={galleryScreen}
                    alt="Photo gallery full of screenshots"
                    draggable="false"
                    className={ARTBOARD}
                  />
                </div>
              </div>

              <img src={phoneFrame} alt="" draggable="false" className={FRAME} />
            </div>

            <div data-role="note" className={NOTE_WRAP}>
              <i className={NOTE_LINE} />
              <span data-role="noteText" className={NOTE_CARD} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
