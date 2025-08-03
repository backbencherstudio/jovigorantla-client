import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  Plus,
  UserRound,
  LogOut,
  Search,
  Bell,
  MessageCircle,
  Info,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import LocationSelector from "@/components/LocationSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "@/components/AuthModal";
import { Badge } from "@/components/ui/badge";

// Create a context to manage unread message count across components
import React from "react";
import { toast } from "sonner";
import { useMessages } from "@/context/MessageContext";
import LocationWithRedius from "./LocationWithRedius";
import useRedirectNav from "@/hooks/useRedirectNav";

// export const UnreadMessagesContext = React.createContext<{
//   unreadMessages: number;
//   setUnreadMessages: React.Dispatch<React.SetStateAction<number>>;
// }>({
//   unreadMessages: 0,
//   setUnreadMessages: () => {},
// });

// export const useUnreadMessages = () => React.useContext(UnreadMessagesContext);
function sumRecord(record: Record<string, number>): string {
  let sum = 0;
  for (const value of Object.values(record)) {
    sum += value;
    if (sum > 9) {
      return `${9}+`; // Stop looping once the sum is 9 or more
    }
  }
  return String(sum);
}

interface HeaderProps {
  searchInput?: string;
  onSearchInputChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
}

const Header = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isModalOpen } = useAuth();
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, defaultTab, openModal, closeModal } = useAuthModal();

  const [searchValue, setSearchValue] = useState("");

  const { unreadMessages } = useMessages();

  // console.log(unreadMessages)

  // Check if user is employee or admin
  const isEmployee =
    user && (user.email?.includes("admin") || user.email?.includes("employee"));

  // Get first name from email or use first letter as fallback
  const getFirstName = () => {
    if (!user?.email) return "U";

    // Try to extract a name from the email (part before @)
    const emailName = user.email.split("@")[0];

    // Capitalize first letter and return
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  const unreadMessagesCount = sumRecord(unreadMessages);

  // useEffect(() => {
  //   // Extract search query from URL if present
  //   const params = new URLSearchParams(location.search);
  //   const queryParam = params.get("q");
  //   if (queryParam) {
  //     setSearchQuery(queryParam);
  //   }
  // }, [location.search]);

  const { redirectNavLink } = useRedirectNav();

  const handlePostAd = () => {
    redirectNavLink("/create-listing");
    // if (user) {
    //   navigate("/create-listing");
    // } else {
    //   openModal("login");
    // }
  };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     navigate(`/?q=${encodeURIComponent(searchQuery)}`);
  //   } else {
  //     // If search is empty, navigate to home without query params
  //     navigate("/");
  //   }
  // };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     navigate(`${location.pathname}?q=${encodeURIComponent(searchQuery)}`);
  //   } else {
  //     // If search is empty, navigate to current path without query params
  //     navigate(location.pathname);
  //   }
  // };

  //   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = e.target.value;
  //     setSearchQuery(value);

  //     // If search field is cleared, navigate to home without query
  //     if (!value.trim() && location.search.includes("q=")) {
  //       navigate("/");
  //     }
  //   };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const currentPath = location.pathname;

  //   if (searchQuery.trim()) {
  //     navigate(`${currentPath}?query=${encodeURIComponent(searchQuery.trim())}`);
  //     handleSetSearchQuery?.(searchQuery.trim());
  //   } else {
  //     // If empty, clear the query from current path
  //     navigate(currentPath);
  //     handleSetSearchQuery?.("");
  //   }
  // };

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setSearchQuery(value);

  //   // Optional: Auto-reset if user clears input and URL has a query
  //   if (!value.trim() && location.search.includes("query=")) {
  //     navigate(location.pathname);
  //     handleSetSearchQuery?.("");

  //   }
  // };

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   onSearchChange(value);

  //   if (!value.trim()) {
  //     navigate(location.pathname);
  //   }
  // };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const trimmed = searchQuery.trim();
  //   if (trimmed) {
  //     navigate(`${location.pathname}?query=${encodeURIComponent(trimmed)}`);
  //   } else {
  //     navigate(location.pathname);
  //   }
  // };
  const handleClearInput = () => {
    // onSearchInputChange(""); // Clear the search input value
    // Clear the search input value
    setSearchValue("");
    // Navigate to the current path without the query parameter
    // navigate(location.pathname);
  };

  useEffect(() => {
    // Get the search query parameter `q` from the URL
    const params = new URLSearchParams(location.search);
    const query = params.get("q");

    // Update the state with the query if it exists
    if (query) {
      setSearchValue(query);
    }
  }, [location.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // onSearchInputChange(e.target.value);
    setSearchValue(e.target.value);
    // if (!e.target.value.trim()) {
    //   navigate(location.pathname);
    // }
  };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSearchSubmit(searchInput);

  // };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue?.trim();
    // console.log(query)

    // If the search query exists, update the query params, otherwise navigate to current path
    if (query) {
      navigate(`${location.pathname}?q=${encodeURIComponent(query)}`);
    } else {
      // If the input is empty, navigate to the current path without the query parameter
      navigate(location.pathname);
    }

    // Optional: Trigger the onSearchSubmit function if you need to handle search elsewhere in the app
    // onSearchSubmit(query);
  };

  const handleSignOut = async () => {
    const isLogout = await signOut();
    // Navigation happens in the signOut function now
    if (isLogout) {
      navigate("/");
      toast.warning("Logout successful");
    } else {
      toast.error("Something went wrong", {
        className: "bg-red-500 text-white border-none text-center",
      });
    }
  };

  // Mobile icon size - slightly larger for mobile
  // const mobileIconSize = isMobile ? 6 : 5.5;

  // List of paths to check against
  const validPaths = [
    "/",
    "/marketplace",
    "/rides",
    "/accommodations",
    "/jobs",
  ];

  // Check if current path matches any of the valid paths
  const isValidPage = validPaths.includes(location.pathname);

  return (
    <>
      <header
        className={`bg-white px-4 md:px-6 border-b fixed  right-0 left-0 pt-6 -top-4 flex flex-1 shadow-sm py-[13px] ${
          !isModalOpen ? "z-[102]" : "z-[20]"
        }`}
      >
        <div className="max-w-full mx-auto flex w-[100%] justify-between">
          {/* Logo */}
          <Link to={"/"} className="flex items-center">
            <img
              src="/lovable-uploads/734bcb13-cbaa-4ead-b63a-d6fa46648627.png"
              alt="DesiEasy Logo"
              className="h-10"
            />
          </Link>

          {/* Search - Only on Tablet and Desktop */}
          {isValidPage && (
            <form
              onSubmit={handleSearch}
              className=" mx-4 w-[25vw] relative hidden md:block"
              // style={{ display: isValidPage ? (isMobile ? 'none' : 'block') : 'none' }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={handleSearchChange}
                className="pl-9 pr-4 py-2 rounded-full bg-gray-100 border-none h-10 w-full focus:ring-2 focus:border-none focus-visible:ring-2 focus-visible:ring-offset-0"
              />
              {searchValue && (
                <X
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer w-5 h-5"
                  onClick={handleClearInput} // Clear the input on click
                />
              )}
            </form>
          )}

          {/* <LocationWithRedius /> */}

          <div className="flex items-center justify-end gap-2">
            {/* Location - Only on Tablet and Desktop */}
            {!isMobile && (
              <div className="hidden md:flex items-center mr-4">
                {/* <LocationSelector /> */}
                <LocationWithRedius />
              </div>
            )}

            {/* Right side elements */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Employee Panel Link - Only for employees */}
              {isEmployee && (
                <Button
                  onClick={() => navigate("/employee")}
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                >
                  <Users
                    className={`text-brand ${
                      isMobile ? "h-6 w-6" : "h-5.5 w-5.5"
                    }`}
                  />
                </Button>
              )}

              {/* Post button with plus icon - Reduced size */}
              <Button
                onClick={handlePostAd}
                className="bg-brand text-white flex items-center gap-1 rounded-full px-3 py-1.5 h-8 md:h-8 text-xs md:text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Post</span>
              </Button>

              {/* Messages button with notification badge - Only shown for logged in users */}
              {user && (
                <div
                  onClick={() => redirectNavLink("/messages")}
                  className="relative  rounded-full cursor-pointer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 bg-[#f1f5f9]"
                  >
                    <MessageCircle
                      className={`text-brand ${
                        isMobile ? "h-6 w-6" : "h-5.5 w-5.5"
                      }`}
                    />
                  </Button>
                  {parseInt(unreadMessagesCount) > 0 && (
                    <Badge className="absolute top-1 right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[9px] hover:bg-[#bf072c] bg-[#bf072c] border-white border">
                      {unreadMessagesCount}
                    </Badge>
                  )}
                </div>
              )}

              {/* User menu */}
              {user ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-gray-100 w-8 h-8 md:w-8 md:h-8"
                    >
                      <UserRound
                        className={
                          isMobile ? "h-6 w-6 text-brand" : "h-5 w-5 text-brand"
                        }
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 z-[102] relative"
                  >
                    <DropdownMenuItem
                      onClick={() => redirectNavLink("/profile")}
                    >
                      <UserRound className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => redirectNavLink("/saved-listings")}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      <span>Saved Listings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => redirectNavLink("/my-listings")}
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 17L12 22L22 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12L12 17L22 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 7L12 12L22 7L12 2L2 7Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Manage Listings</span>
                    </DropdownMenuItem>
                    {isEmployee && (
                      <DropdownMenuItem
                        onClick={() => redirectNavLink("/employee")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        <span>Employee Panel</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => redirectNavLink("/about-us")}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      <span>About Us</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-[#b3261e]"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  className="rounded-full bg-gray-100 hover:bg-gray-200 h-8 px-3 text-xs"
                  onClick={() => openModal("login")}
                >
                  <span className="font-semibold text-black">Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        open={isOpen}
        onOpenChange={closeModal}
        defaultTab={defaultTab}
      />
    </>
  );
};

export default Header;
