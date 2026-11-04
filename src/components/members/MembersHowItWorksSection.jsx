import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { goToApp } from "../../utils/deviceRedirect";
import { cldUrl } from "../../lib/cloudinary";

const memberSignupCard = cldUrl("glass/howItWorks/member-signup-card", { width: 2400 });
const memberSignupCardMobile = cldUrl("glass/howItWorks/member-signup-card-mobile", {
  width: 1600,
});
const memberAcceptInvite = cldUrl("glass/howItWorks/member-accept-invite", { width: 1600 });
const memberAcceptInviteMobile = cldUrl("glass/howItWorks/member-accept-invite-mobile", {
  width: 1600,
});
const memberAutopay = cldUrl("glass/howItWorks/member-autopay", { width: 1600 });
const memberAutopayMobile = cldUrl("glass/howItWorks/member-autopay-mobile", {
  width: 1600,
});

export default function MembersHowItWorksSection() {
  const navigate = useNavigate();

  function handleJoin() {
    goToApp("/member/join", navigate);
  }

  return (
    <section className="relative isolate overflow-hidden py-24" id="how-it-works">
      <div className="relative z-10 max-w-[880px] mx-auto px-6">
        <div className="text-center mb-12 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center border border-[#1C2B8A]/20 text-[#1C2B8A] text-[12px] font-semibold px-5 py-2 rounded-full mb-7"
          >
            How We Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(26px,5vw,58px)] font-bold text-[#0f1d6e] leading-tight tracking-tight mb-5"
          >
            Launch Transparent Payments
            <br className="hidden md:block" /> in Minutes
          </motion.h2>
          <motion.p
            className="text-[17px] text-[#00000099] max-w-[720px] mx-auto leading-relaxed"
            initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Set up your community, link member payment methods, and let Glass handle the rest.
          </motion.p>
        </div>
      </div>

      <div className="hidden md:block relative z-10 mx-auto px-6 max-w-[800px] lg:max-w-[1330px]">
        <img
          src={memberSignupCard}
          alt="Sign up for Glass in seconds"
          className="w-[728px] h-[423px] lg:w-[1213px] lg:h-[705px] rounded-3xl object-cover"
        />
        <div className="flex gap-6 mt-6">
          <img
            src={memberAcceptInvite}
            alt="Accept Your Community Invite"
            className="order-1 w-[357px] h-[436px] lg:w-[595px] lg:h-[727px] shrink-0 rounded-[8px]"
          />
          <img
            src={memberAutopay}
            alt="Automate your dues. Never miss a payment."
            className="order-2 w-[357px] h-[436px] lg:w-[595px] lg:h-[727px] shrink-0 rounded-[8px]"
          />
        </div>
      </div>

      <div className="md:hidden relative z-10 flex flex-col gap-4 px-4">
        <img
          src={memberSignupCardMobile}
          alt="Sign up for Glass in seconds"
          className="w-full h-auto rounded-[8px]"
        />
        <img
          src={memberAcceptInviteMobile}
          alt="Accept Your Community Invite"
          className="w-full h-auto rounded-[8px]"
        />
        <img
          src={memberAutopayMobile}
          alt="Automate your dues. Never miss a payment."
          className="w-full h-auto rounded-[8px]"
        />
      </div>

      <div className="relative z-10 max-w-[880px] mx-auto px-6">
        <div className="flex justify-center mt-12 md:mt-20">
          <motion.button
            onClick={handleJoin}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-flex items-center gap-3 rounded-sm bg-[#002fa7] px-8 py-4 text-[14px] font-bold text-white shadow-2xl shadow-[#002fa7]/25"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
              whileHover={{ translateX: "250%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10">Join Glass</span>
            <motion.svg
              className="relative z-10"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
