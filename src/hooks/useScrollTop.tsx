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

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const container = document.getElementById("main-scroll-container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return <>{children}</>;
};

export default ScrollToTop;
