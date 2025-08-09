import { useMessages } from "@/context/MessageContext";
import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";

export default function RouteChangeListener() {
  const location = useLocation();
  const { setActiveConversation } = useMessages();

  useEffect(() => {
    const onMessages =
      !!matchPath({ path: "/messages/*", end: false }, location.pathname) ||
      location.pathname === "/messages";

    if (!onMessages) {
      // Update however you need — usually clear it:
      setActiveConversation(null);
      // Or, if you want to mark “inactive” instead:
      // setActiveConversation((prev) => prev ? { ...prev, inactive: true } : null);
    }
  }, [location.pathname, setActiveConversation]);

  return null; // just a watcher
}
