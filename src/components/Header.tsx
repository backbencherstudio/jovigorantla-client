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

export const UnreadMessagesContext = React.createContext<{
  unreadMessages: number;
  setUnreadMessages: React.Dispatch<React.SetStateAction<number>>;
}>({
  unreadMessages: 0,
  setUnreadMessages: () => {},
});

export const useUnreadMessages = () => React.useContext(UnreadMessagesContext);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, defaultTab, openModal, closeModal } = useAuthModal();

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

  // Track unread messages
  const [unreadMessages, setUnreadMessages] = useState(2); // For demo, defaulting to 2

  useEffect(() => {
    // Extract search query from URL if present
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [location.search]);

  const handlePostAd = () => {
    navigate("/create-listing");
    // if (user) {
    //   navigate("/create-listing");
    // } else {
    //   openModal("login");
    // }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      // If search is empty, navigate to home without query params
      navigate("/");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If search field is cleared, navigate to home without query
    if (!value.trim() && location.search.includes("q=")) {
      navigate("/");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    // Navigation happens in the signOut function now
  };

  // Mobile icon size - slightly larger for mobile
  const mobileIconSize = isMobile ? 6 : 5.5;

  return (
    <UnreadMessagesContext.Provider
      value={{ unreadMessages, setUnreadMessages }}
    >
      <header className="bg-white px-4 md:px-6 border-b sticky top-0 z-20 shadow-sm py-[13px]">
        <div className="max-w-full mx-auto flex justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/734bcb13-cbaa-4ead-b63a-d6fa46648627.png"
              alt="DesiEasy Logo"
              className="h-10"
            />
          </Link>

          {/* Search - Only on Tablet and Desktop */}
          {!isMobile && (
            <form onSubmit={handleSearch} className=" mx-4 w-[25vw] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 pr-4 py-2 rounded-full bg-gray-100 border-none h-10 w-full focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </form>
          )}

          <div className="flex items-center justify-end gap-2">
            {/* Location - Only on Tablet and Desktop */}
            {!isMobile && (
              <div className="hidden md:flex items-center mr-4">
                <LocationSelector />
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
                className="bg-brand hover:bg-brand/90 text-white flex items-center gap-1 rounded-full px-3 py-1.5 h-8 md:h-8 text-xs md:text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Post</span>
              </Button>

              {/* Messages button with notification badge - Only shown for logged in users */}
              {user && (
                <div
                  onClick={() => navigate("/messages")}
                  className="relative  rounded-full cursor-pointer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 bg-[#f1f5f9]"
                  >
                    <MessageCircle
                      className={`text-brand ${
                        isMobile ? "h-6 w-6" : "h-5.5 w-5.5"
                      }`}
                    />
                  </Button>
                  {unreadMessages > 0 && (
                    <Badge className="absolute top-1 right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[9px] hover:bg-[#bf072c] bg-[#bf072c] border-white border">
                      {unreadMessages}
                    </Badge>
                  )}
                </div>
              )}

              {/* User menu */}
              {user ? (
                <DropdownMenu>
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
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <UserRound className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/saved-listings")}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      <span>Saved Listings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-listings")}>
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
                      <DropdownMenuItem onClick={() => navigate("/employee")}>
                        <Users className="h-4 w-4 mr-2" />
                        <span>Employee Panel</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate("/about-us")}>
                      <Info className="h-4 w-4 mr-2" />
                      <span>About Us</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-[#bc0117]"
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
    </UnreadMessagesContext.Provider>
  );
};

export default Header;
