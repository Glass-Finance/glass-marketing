import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSeoMeta } from "../hooks/useSeoMeta";
import PageGlow from "../components/common/PageGlow";
import Navbar from "../components/Navbar";
import Hero from "../components/organizations/Hero";
import ProblemSection from "../components/organizations/ProblemSection";
import OurSolution from "../components/organizations/OurSolution";
import GetStarted from "../components/organizations/GetStarted";
import UseCases from "../components/UseCases";
import TrustedBy from "../components/TrustedBy";
import OrganizationSecurity from "../components/organizations/OrganizationSecurity";
import CTA from "../components/organizations/CTA";
import WhyGlass from "../components/WhyGlass";
import Footer from "../components/Footer";

export default function OrganizationsHome() {
  useSeoMeta({
    title: "Manage Community Payments Effortlessly",
    description:
      "Stop chasing dues in group chats. Glasspay lets Nigerian associations, clubs, and schools collect, track, and manage community funds in one place.",
    path: "/",
  });
  useScrollReveal();

  // Footer's "Features"/"How It Works" links point at /#solution and
  // /#how-it-works. Since Home is lazy-loaded, a hard navigation from any
  // other route (the only way a plain <a> gets here) fires the browser's
  // one-shot native fragment scroll before this page has rendered --
  // it finds no matching element and never retries, so the visitor lands
  // at the top instead. Do the scroll ourselves once mounted.
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <div>
      <PageGlow />
      <Navbar />
      <Hero />
      <ProblemSection />
      <OurSolution />
      <GetStarted />
      <UseCases />
      <TrustedBy />
      <OrganizationSecurity />
      <CTA />
      <WhyGlass />
      <Footer />
    </div>
  );
}
