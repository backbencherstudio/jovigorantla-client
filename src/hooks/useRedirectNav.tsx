import { useNavigate } from "react-router-dom";


export default function useRedirectNav() {
  const navigate = useNavigate();

  const redirectNavLink = (path: string) => {
    const currentScrollY = window.scrollY;
    sessionStorage.setItem("home_scroll_position", currentScrollY.toString());

    window.scrollTo(0, 0);

    navigate(path);
  };

  return { redirectNavLink };
}
