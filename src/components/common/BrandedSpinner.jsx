import { useEffect, useState } from "react";
import { cldUrl, cldSrcSet } from "../../lib/cloudinary";

// Ported from glass-waitlist's components/common/BrandedSpinner.jsx so the
// two loading screens render identically (the logo-fill treatment replaced
// the old spinning ring there). The Cloudinary call differs only because
// this repo's CloudImage is cover-only with a blur crossfade — fine for
// landing imagery, wrong for a fixed contain-fit logo mark — so the spinner
// renders a plain <img> the way the app's component effectively does.
//
// The logo mark IS the spinner: a grayscale 14% ghost of the mark with a
// full-color copy that fills in bottom-to-top (logo-fill keyframes in
// index.css) and fades out, looping. No ring, no label.

const DEFAULT_ANIMATION_DURATION = "2.6s";
const VERY_FAST_ANIMATION_DURATION = "0.9s";
const LOGO_WIDTHS = [32, 64, 96, 128, 192];
const LOGO_PUBLIC_ID = "glass/Glass";

export default function BrandedSpinner({ size = 64 }) {
  const [animationDuration, setAnimationDuration] = useState(DEFAULT_ANIMATION_DURATION);
  const height = Math.round(size * (200 / 212));

  useEffect(() => {
    const connection = navigator.connection;
    if (!connection?.addEventListener) return undefined;

    function updateDuration() {
      if (
        connection.saveData ||
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g"
      ) {
        setAnimationDuration("5.4s");
      } else if (
        connection.effectiveType === "5g" ||
        (connection.effectiveType === "4g" &&
          Number(connection.downlink) >= 10 &&
          Number(connection.rtt) <= 100)
      ) {
        // Most browsers report 5G as "4G"; use throughput and latency too.
        setAnimationDuration(VERY_FAST_ANIMATION_DURATION);
      } else if (connection.effectiveType === "4g") {
        setAnimationDuration("1.8s");
      } else {
        setAnimationDuration(DEFAULT_ANIMATION_DURATION);
      }
    }

    updateDuration();
    connection.addEventListener("change", updateDuration);
    return () => connection.removeEventListener("change", updateDuration);
  }, []);

  // srcSet up to 2x the rendered width so retina screens stay crisp without
  // phones downloading desktop-sized files.
  const maxWidth = size * 2;
  const widths = [...new Set([...LOGO_WIDTHS, maxWidth].filter((w) => w <= maxWidth))].sort(
    (a, b) => a - b,
  );

  const logo = (
    <img
      src={cldUrl(LOGO_PUBLIC_ID, { width: maxWidth })}
      srcSet={cldSrcSet(LOGO_PUBLIC_ID, widths)}
      sizes={`${size}px`}
      alt=""
      draggable={false}
      className="h-full w-full object-contain"
    />
  );

  return (
    <div
      role="status"
      aria-label="Loading"
      className="relative flex-shrink-0"
      style={{
        width: size,
        height,
        "--logo-fill-duration": animationDuration,
      }}
    >
      <div className="absolute inset-0 opacity-[.14] grayscale">{logo}</div>

      <div className="absolute inset-0 animate-logo-fill motion-reduce:animate-none">{logo}</div>
    </div>
  );
}
