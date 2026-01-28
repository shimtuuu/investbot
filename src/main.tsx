import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/ui.css";

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const deviceMemory = "deviceMemory" in navigator ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory : undefined;
const hardwareConcurrency =
  "hardwareConcurrency" in navigator ? navigator.hardwareConcurrency : undefined;

if (
  prefersReducedMotion ||
  (typeof deviceMemory === "number" && deviceMemory <= 4) ||
  (typeof hardwareConcurrency === "number" && hardwareConcurrency <= 4)
) {
  root.classList.add("low-perf");
}

// Prevent pinch/zoom gestures inside the mini app.
const preventGesture = (event: Event) => event.preventDefault();
document.addEventListener("gesturestart", preventGesture, { passive: false });
document.addEventListener("gesturechange", preventGesture, { passive: false });
document.addEventListener("gestureend", preventGesture, { passive: false });

document.addEventListener(
  "wheel",
  (event) => {
    if ((event as WheelEvent).ctrlKey) {
      event.preventDefault();
    }
  },
  { passive: false }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
