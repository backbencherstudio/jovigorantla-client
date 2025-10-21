// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
//   const location = useLocation();
//   useEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//   }, [location]);

//   return <>{children}</>;
// };

// export default ScrollToTop;

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
    // Only scroll on new navigations, not browser back/forward
    if (navigationType !== "POP") {
      const timeout = setTimeout(() => {
        const layout = document.getElementById("main-layout");

        if (layout && layout.scrollHeight > layout.clientHeight) {
          // Scroll the layout div if it's scrollable
          layout.scrollTo({ top: 0, behavior: "smooth" });
          console.log(`[ScrollToTop] Scrolled #main-layout to top`);
        } else {
          // Fallback to window scroll
          window.scrollTo({ top: 0, behavior: "smooth" });
          console.log(`[ScrollToTop] Scrolled window to top`);
        }
      }, 50); // small delay to wait for render

      return () => clearTimeout(timeout);
    }
  }, [location, navigationType]);

  return <>{children}</>;
};

export default ScrollToTop;
