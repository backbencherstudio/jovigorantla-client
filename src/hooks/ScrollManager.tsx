// ScrollManager.tsx
import { useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";

export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType(); // POP/PUSH/REPLACE
  const firstPaint = useRef(true);

  // 1) Disable browser auto-restoration everywhere
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 2) Compute stable header height → set CSS var for anchoring offsets
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-sticky-header]");
    const h = header?.offsetHeight ?? 0;
    document.documentElement.style.setProperty("--header-h", `${h}px`);
  });

  // 3) Fix iOS address bar & 100vh issues → keep a real dvh var up to date
  useEffect(() => {
    const setDVH = () => {
      const vv = (window as any).visualViewport;
      const h = vv?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--dvh", `${h}px`);
    };
    setDVH();
    const vv = (window as any).visualViewport;
    vv?.addEventListener?.("resize", setDVH);
    vv?.addEventListener?.("scroll", setDVH);
    window.addEventListener("resize", setDVH);
    return () => {
      vv?.removeEventListener?.("resize", setDVH);
      vv?.removeEventListener?.("scroll", setDVH);
      window.removeEventListener("resize", setDVH);
    };
  }, []);

  // 4) Hard reset scroll on route change (before paint), but respect hashes
  useLayoutEffect(() => {
    if (hash) return; // let native hash scrolling happen; CSS will offset it
    // POP sometimes implies user “back”; still force to top to kill ghost restore
    window.scrollTo(0, 0);
  }, [pathname, key]);

  // 5) After paint, kill any late “nudge” (focus/anchoring/layout) with a 2x RAF
  useEffect(() => {
    if (hash) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    });
  }, [pathname, key, hash]);

  // 6) Minimal logger to catch what’s moving the page
  useEffect(() => {
    if (!firstPaint.current) return;
    firstPaint.current = false;

    let lastY = window.scrollY;
    const log = (reason: string) =>
      console.debug(`[ScrollManager] ${reason}:`, {
        y: Math.round(window.scrollY),
        active: document.activeElement?.tagName,
        hash: location.hash,
      });

    // Log first 500ms of unexpected movement
    const t = setInterval(() => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 2) {
        log("scroll changed");
        lastY = y;
      }
    }, 50);
    setTimeout(() => clearInterval(t), 600);

    // Watch focus (very common cause)
    const onFocus = (e: FocusEvent) => {
      const el = e.target as Element;
      console.debug("[ScrollManager] focus ->", el?.tagName, el?.id || el?.className);
    };
    window.addEventListener("focusin", onFocus);
    return () => window.removeEventListener("focusin", onFocus);
  }, []);

  return null;
}
