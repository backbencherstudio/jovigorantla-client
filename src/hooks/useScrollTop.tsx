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
