import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

function normalizeViewportVars() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const root = document.documentElement;

  const applyVars = () => {
    const vv = (window as any).visualViewport;
    const h = Math.round(vv?.height ?? window.innerHeight);
    root.style.setProperty("--vh", `${h}px`);
    root.style.setProperty("--safe-top", "env(safe-area-inset-top,0px)");
    root.style.setProperty("--safe-bottom", "env(safe-area-inset-bottom,0px)");
  };

  // Add a style tag once to handle all Tailwind classes like min-h-[100vh...]
  if (!document.getElementById("vh-auto-fix")) {
    const style = document.createElement("style");
    style.id = "vh-auto-fix";
    style.textContent = `
      :root {
        --vh: 100svh;
        --safe-top: env(safe-area-inset-top,0px);
        --safe-bottom: env(safe-area-inset-bottom,0px);
      }
      [class*="min-h-[100vh"] {
        min-height: calc(var(--vh) - var(--safe-top) - var(--safe-bottom)) !important;
      }
    `;
    document.head.appendChild(style);
  }

  let raf = 0;
  const queue = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(applyVars);
  };

  window.addEventListener("resize", queue, { passive: true });
  window.addEventListener("orientationchange", queue, { passive: true });
  (window as any).visualViewport?.addEventListener("resize", queue, {
    passive: true,
  });
  (window as any).visualViewport?.addEventListener("scroll", queue, {
    passive: true,
  });

  applyVars();
}

// ✅ Run once globally before the app renders
normalizeViewportVars();

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
