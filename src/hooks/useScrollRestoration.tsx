export default function useScrollRestoration() {
  return;
}

/* import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map<string, number>();

export default function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let timeout;

    const savedPosition = scrollPositions.get(path);
    if (savedPosition !== undefined) {
      timeout = setTimeout(() => {
        console.log("setting scroll values");
        // window.scrollTo(0, savedPosition);
      }, 500);
    }

    const onScroll = () => {
      scrollPositions.set(path, window.scrollY);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, [location.pathname]);
}
 */
