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
const featureAutomate = {
  src: cldUrl("glass/solution/automate", { width: 800, format: "svg" }),
  srcSet: cldSrcSet("glass/solution/automate", ILLUS_WIDTHS, { format: "svg" }),
};
const featureRecover = {
  src: cldUrl("glass/solution/recover", { width: 800, format: "svg" }),
  srcSet: cldSrcSet("glass/solution/recover", ILLUS_WIDTHS, { format: "svg" }),
};
const featureProof = {
  src: cldUrl("glass/solution/proof", { width: 800, format: "svg" }),
  srcSet: cldSrcSet("glass/solution/proof", ILLUS_WIDTHS, { format: "svg" }),
};
const featureMonitor = {
  src: cldUrl("glass/solution/monitor", { width: 800, format: "svg" }),
  srcSet: cldSrcSet("glass/solution/monitor", ILLUS_WIDTHS, { format: "svg" }),
};

const features = [
  {
    icon: icon2,
    title: "Set Up Recurring Payment Plans",
    desc: "Set up recurring dues and let Glass handle scheduled collections.",
    illustration: featureAutomate,
  },
  {
    icon: icon1,
    title: "Stay on Top of Outstanding Payments",
    desc: "Easily identify unpaid contributions and follow up with members who still need to pay.",
    illustration: featureRecover,
  },
  {
    icon: icon3,
    title: "Track Each Member Payment History",
    desc: "Review individual member payments and total collections per plan.",
    illustration: featureProof,
  },
  {
    icon: icon4,
    title: "Built for Every Contribution",
    desc: "Create recurring plans for regular dues or one-time plans for any specific need.",
    illustration: featureMonitor,
  },
];

export default function OurSolution() {
  return (
    <SolutionSection
      headline="Built-In Transparency for Every Transaction"
      subtext="Centralize payments, records, and visibility in one shared system, so your team stops chasing and starts leading."
      subtextMaxWidth={640}
      features={features}
    />
  );
}
