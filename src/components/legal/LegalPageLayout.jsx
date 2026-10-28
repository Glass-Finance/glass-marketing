import { Link } from "react-router-dom";
import { cldUrl, cldSrcSet } from "../../lib/cloudinary";

const glassLogo = {
  src: cldUrl("glass/Glass", { width: 24 }),
  srcSet: cldSrcSet("glass/Glass", [24, 48, 72]),
};
// Background is a CSS background-image, so srcSet doesn't apply here —
// requesting a flat 2x (dpr) instead of a responsive width ladder, same
// approach as ErrorBoundary.jsx's background.
const backgroundUrl = cldUrl("glass/background", { width: 1920, dpr: 2 });

export default function LegalPageLayout({ title, effectiveDate, lastUpdated, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="absolute inset-0 bg-white/90" />

      <div className="relative z-10">
        <header className="border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 no-underline">
              <img
                src={glassLogo.src}
                srcSet={glassLogo.srcSet}
                sizes="24px"
                alt="Glass"
                className="w-6 h-6"
              />
              <span className="font-bold text-lg text-gray-900">Glass</span>
            </Link>
            <Link
              to="/"
              className="text-xs font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors"
            >
              ← Back to glasspay.app
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-xs text-gray-500 mb-10">
            Effective Date: {effectiveDate} &nbsp;·&nbsp; Last Updated: {lastUpdated}
          </p>
          <div className="legal-prose">{children}</div>
        </main>

        <footer className="border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-8 text-center">
            <p className="text-xs text-gray-400">
              Copyright © {new Date().getFullYear()} Glass Limited
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
