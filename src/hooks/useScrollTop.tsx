// First Approach

import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location, navigationType]);

  return <>{children}</>;
};
export default ScrollToTop;


// 2nd Approach

/* import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP") {
      const timeout = setTimeout(() => {
        const layout = document.getElementById("main-layout");

        // Try both layout scroll and window scroll
        if (layout && layout.scrollHeight > layout.clientHeight) {
          layout.scrollTop = 0;

          // iOS Chrome workaround: force reflow
          //layout.style.transform = "translateY(0px)";
          requestAnimationFrame(() => {
            layout.scrollTop = 0;
          });
        } else {
          window.scrollTo(0, 0);
          // iOS Chrome workaround: force reflow + scroll again
          //document.body.style.transform = "translateY(0px)";
          requestAnimationFrame(() => {
            window.scrollTo(0, 0);
          });
        }
      }, 50); // delay helps ensure content is rendered

      return () => clearTimeout(timeout);
    }
  }, [location, navigationType]);

  return <>{children}</>;
};

export default ScrollToTop; */


// 3rd approach

/* import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Only preserve scroll position for back/forward navigation (POP)
    // But always scroll to top for logo clicks and other navigations
    const shouldScrollToTop = navigationType !== "POP" || 
                             location.pathname === "/"; // Always scroll to top when going home

    if (shouldScrollToTop) {
      const timeout = setTimeout(() => {
        const layout = document.getElementById("main-layout");

        if (layout && layout.scrollHeight > layout.clientHeight) {
          layout.scrollTop = 0;
          requestAnimationFrame(() => {
            layout.scrollTop = 100;
          });
        } else {
          window.scrollTo(0, 100);
          requestAnimationFrame(() => {
            window.scrollTo(0, 100);
          });
        }
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [location, navigationType]);

  return <>{children}</>;
};

export default ScrollToTop; */
