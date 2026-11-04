import { useLayoutEffect, useRef, useState } from "react";
import DashboardOverlay from "./DashboardOverlay";

// Measure the responsive mockup after its CSS layout changes so the wrapper
// reserves its full height without scaling the mobile view down to desktop size.
export default function ScaledDashboard() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [naturalHeight, setNaturalHeight] = useState(0);

  useLayoutEffect(() => {
    function measure() {
      if (!outerRef.current || !innerRef.current) return;
      const h = innerRef.current.offsetHeight;
      if (h > 0) setNaturalHeight(h);
    }
    measure();
    window.addEventListener("resize", measure);
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(measure);
      if (outerRef.current) observer.observe(outerRef.current);
      if (innerRef.current) observer.observe(innerRef.current);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", measure);
      };
    }
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={outerRef}
      style={{
        width: "100%",
        overflow: "hidden",
        height: naturalHeight || undefined,
      }}
    >
      <div ref={innerRef} style={{ width: "100%" }}>
        <DashboardOverlay />
      </div>
    </div>
  );
}
