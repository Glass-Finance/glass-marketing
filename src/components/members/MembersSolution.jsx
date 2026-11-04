import { cldUrl, cldSrcSet } from "../../lib/cloudinary";
import SolutionSection from "../common/SolutionSection";

const ICON_WIDTHS = [50, 100, 150];
const ILLUS_WIDTHS = [400, 800, 1200, 1600];
const icon1 = {
  src: cldUrl("glass/icon/frame1", { width: 100 }),
  srcSet: cldSrcSet("glass/icon/frame1", ICON_WIDTHS),
};
const icon2 = {
  src: cldUrl("glass/icon/frame2", { width: 100 }),
  srcSet: cldSrcSet("glass/icon/frame2", ICON_WIDTHS),
};
const icon3 = {
  src: cldUrl("glass/icon/frame3", { width: 100 }),
  srcSet: cldSrcSet("glass/icon/frame3", ICON_WIDTHS),
};
const icon4 = {
  src: cldUrl("glass/icon/frame4", { width: 100 }),
  srcSet: cldSrcSet("glass/icon/frame4", ICON_WIDTHS),
};
const featurePayment = {
  src: cldUrl("glass/solution/payment", { width: 800, format: "svg" }),
  srcSet: cldSrcSet("glass/solution/payment", ILLUS_WIDTHS, { format: "svg" }),
};
const featureReminder = {
  src: cldUrl("glass/solution/reminder", { width: 800, format: "svg" }),
  srcSet: cldSrcSet("glass/solution/reminder", ILLUS_WIDTHS, { format: "svg" }),
};
const featureHistory = {
  src: cldUrl("glass/solution/payment-history", { width: 800, format: "svg" }),
  srcSet: cldSrcSet("glass/solution/payment-history", ILLUS_WIDTHS, { format: "svg" }),
};
const featureInstant = {
  src: cldUrl("glass/solution/instant", { width: 800, format: "svg" }),
  srcSet: cldSrcSet("glass/solution/instant", ILLUS_WIDTHS, { format: "svg" }),
};

const features = [
  {
    icon: icon2,
    title: "One-Click Payments",
    desc: "Pay your dues in seconds from any device. No more manual transfers.",
    illustration: featurePayment,
    illustrationBackground: true,
  },
  {
    icon: icon1,
    title: "Smart Reminders",
    desc: "Get reminders via SMS, WhatsApp, and Email so you never miss a deadline.",
    illustration: featureReminder,
  },
  {
    icon: icon3,
    title: "Easy Access To Your Payment History",
    desc: "Easily track past payments.",
    illustration: featureHistory,
  },
  {
    icon: icon4,
    title: "Generate Instant Proof",
    desc: "Download official receipts immediately after paying.",
    illustration: featureInstant,
  },
];

export default function MembersSolution() {
  return (
    <SolutionSection
      headline="Everything You Need to Pay with Confidence"
      subtext="One tap to pay, instant receipts, and a full history — so you never have to dig through chats again."
      subtextMaxWidth={600}
      features={features}
    />
  );
}
