/* import { useEffect } from "react";
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
export default ScrollToTop; */

import { useEffect } from "react";
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

export default ScrollToTop;
