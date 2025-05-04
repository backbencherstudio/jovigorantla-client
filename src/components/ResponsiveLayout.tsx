import React, { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryIcons from "@/components/CategoryIcons";
import AdBanner from "@/components/AdBanner";
import LocationSelector from "@/components/LocationSelector";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const mobileHeaderRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If search field is cleared, navigate to home without query
    if (!value.trim() && location.search.includes("q=")) {
      navigate("/");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate with search query
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      // If empty search, show all listings
      navigate("/");
    }
  };

  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [location.search]);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down
        setIsVisible(false);
      } else {
        // scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    // cleanup function
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  // Calculate the left sidebar width based on device
  const leftSidebarWidth = isDesktop ? "240px" : isTablet ? "70px" : "0px";
  const rightSidebarWidth = isDesktop ? "300px" : "0px";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1">
        {/* Left Sidebar - Menu (only on desktop/tablet) */}
        {!isMobile && (
          <div className="fixed left-0 top-[60px] h-[calc(100vh-60px)] overflow-y-auto z-10 bg-white shadow-sm">
            <Sidebar collapsed={isTablet} />
          </div>
        )}

        {/* Main Content Area */}
        <div
          className="flex-1 listings-container"
          style={{
            marginLeft: !isMobile ? leftSidebarWidth : "0",
            marginRight: isDesktop ? rightSidebarWidth : "0",
          }}
        >
          {/* Center Content Container */}
          <main className="w-full mx-auto max-w-3xl bg-transparent">
            {/* Mobile: Search, Location and Categories */}
            {isMobile && (
              <div
                ref={mobileHeaderRef}
                className=" z-10 transition-transform bg-white"
              >
                <div className="px-4 pt-2 pb-2">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none h-10"
                      />
                    </div>
                  </form>

                  {/* Mobile: Location display - no border or box */}
                  <div className="mt-2 flex items-center justify-end">
                    <LocationSelector className="text-sm border-none shadow-none p-0" />
                  </div>
                </div>

                {/* Mobile: Category Icons */}
                <div className="px-4 pb-2">
                  <CategoryIcons />
                </div>
              </div>
            )}

            {/* Filter tabs should be in a fixed position with z-index above main content */}
            <div className="sticky top-[60px] z-10 bg-background border-b border-gray-100">
              {children}
            </div>
          </main>
        </div>

        {/* Right sidebar with ad banners - only visible on desktop */}
        {isDesktop && (
          <div className="w-[260px] fixed right-0 top-[60px] bottom-0 bg-white shadow-sm">
            <div className="sticky top-[70px] p-2 space-y-4 overflow-y-auto h-[calc(100vh-70px)] thin-scrollbar">
              <AdBanner position="right_top" className="mb-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
