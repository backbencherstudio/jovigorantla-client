import React, { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryIcons from "@/components/CategoryIcons";
import AdBanner from "@/components/AdBanner";
import LocationSelector from "@/components/LocationSelector";
import SidebarAds from "./ui/Sidebar-Ads";
import LocationWithRadius from "./LocationWithRedius";
import { Button } from "./ui/button";


const PageSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-300 w-3/4 rounded"></div>

      {/* Description Skeleton */}
      <div className="h-6 bg-gray-300 w-full rounded"></div>
      <div className="h-6 bg-gray-300 w-5/6 rounded"></div>

      {/* Image Placeholder Skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-md"></div>

      {/* Text Content Skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
        <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
        <div className="h-4 bg-gray-300 w-full rounded"></div>
      </div>

      {/* Button Skeleton */}
      <div className="h-10 bg-gray-300 w-32 rounded-full"></div>
    </div>
  );
};


interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  hideBackButton?: boolean;
  fullWidth?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, title, hideBackButton = false, fullWidth = false }) => {
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const mobileHeaderRef = useRef<HTMLDivElement>(null);
  const [isMobileHeaderRendered, setIsMobileHeaderRendered] = useState(false);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If search field is cleared, navigate to home without query
    // if (!value.trim() && location.search.includes("q=")) {
    //   navigate(location.pathname);
    // }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Dismiss the keyboard by blurring the active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Navigate with search query
    // Get the current query parameters from the URL
    const currentParams = new URLSearchParams(location.search);

    if (searchQuery.trim()) {

      // Set the 'tab' parameter to true (this will add it if it doesn't exist, or update it)
      currentParams.set('q', encodeURIComponent(searchQuery));

      // Navigate to the same path but with the updated query parameters
      navigate(`${location.pathname}?${currentParams.toString()}`);
      // navigate(`${location.pathname}?q=${encodeURIComponent(searchQuery)}`);
    } else {
      // If empty search, show all listings
      currentParams.delete('q');
      navigate(`${location.pathname}?${currentParams.toString()}`)
      // navigate("/");
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


  const handleClearInput = () => {
    setSearchQuery("");
    // navigate(location.pathname); // Navigate to home without query
  };
  useEffect(() => {
    const queryParam = new URLSearchParams(location.search).get("q") || "";
    setSearchQuery(queryParam);
  }, [location.search]);



  const leftSidebarWidth = isDesktop ? "240px" : isTablet ? "70px" : "0px";
  const rightSidebarWidth = isDesktop ? "300px" : "0px";

  const [width, setWidth] = useState("768px");
  useEffect(() => {
    // Function to update width based on screen size
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024 && screenWidth < 1300) {
        setWidth(`${screenWidth - 540}px`);
      } else {
        setWidth("768px");
      }
    };
    // Set initial width
    updateWidth();
    // Add event listener for window resize
    window.addEventListener("resize", updateWidth);
    // Clean up event listener
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleBack = () => {
    // navigate(-1);
    // Check if there is history to go back to
    if (window.history.length > 1) {
      // If yes, go back
      navigate(-1);
    } else {
      // Otherwise, redirect to home
      navigate('/');
    }
  };


  // List of paths to check against
  const validPaths = ["/", "/marketplace", "/rides", "/accommodations", "/jobs"];

  // Check if current path matches any of the valid paths
  const isValidPage = validPaths.includes(location.pathname);

  //  useEffect(() => {
  //   if (isMobile && mobileHeaderRef.current) {
  //     console.log("Mobile header has rendered");
  //     setTimeout(() => {
  //       setIsMobileHeaderRendered(true);
  //     }, 1000); // Adjust the delay as needed
  //     // setIsMobileHeaderRendered(true);

  //     // You can perform any state changes or side effects here
  //     // For example:
  //     // setSomeOtherState(someValue);
  //   }
  // }, [isMobile]);

  const isHome = location.pathname === "/";
  const [isVisiblef, setIsVisiblef] = useState(isHome ? true : false);

  useEffect(() => {
    if (isHome) {
      setTimeout(() => {
        setIsVisiblef(false);
      }, 300); // Adjust the delay as needed
    }
  })



  return (
    <div className={`flex flex-col  bg-gray-50`}>
      <Header />

      {isVisiblef ? isDesktop ? null : <PageSkeleton /> : <div className="flex flex-1 min-h-[calc(100vh-67px)]">
        {/* Left Sidebar - Menu (only on desktop/tablet) */}
        {!isMobile && (
          <div className="fixed left-0 top-[60px] h-[calc(100vh-60px)] overflow-y-auto z-10 bg-white shadow-sm">
            <Sidebar collapsed={isTablet} />
          </div>
        )}

        {!isValidPage && <main
          className={`w-full mx-auto ${fullWidth ? "" : "max-w-3xl"
            } bg-white flex flex-col flex-1 min-h-[100%]`}
        >
          {/* Page Header with back button */}
          {title && (
            <div className="relative">
              <div
                className="fixed z-20 bg-white  border-b border-gray-100 px-4 py-3 flex items-center"
                style={{
                  width: width,
                  top: "67px" /* Header height */,
                }}
              >
                {!hideBackButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <h1 className="text-xl font-bold">{title}</h1>
              </div>
              <div className="h-[65px] bg-white border-b "></div>
            </div>
          )}

          {/* Page Content */}
          <div className="flex-1 h-full bg-white">{children}</div>
        </main>
        }

        {/* Main Content Area */}
        {isValidPage && <div
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
                      {searchQuery && (
                        <X
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer w-5 h-5"
                          onClick={handleClearInput} // Clear the input on click
                        />
                      )}
                    </div>
                  </form>

                  {/* Mobile: Location display - no border or box */}
                  {/* <div className="mt-2 flex items-center justify-end"> */}
                  {/* <LocationSelector className="text-sm border-none shadow-none p-0" /> */}
                  {/* <LocationWithRadius /> */}
                  {/* </div> */}

                  <div className="mt-2 mr-[-18px] flex items-center justify-end">
                    <LocationWithRadius popupStyle="mr-2" />
                  </div>
                </div>

                {/* Mobile: Category Icons */}
                <div className="px-4 pb-2">
                  <CategoryIcons />
                </div>
              </div>
            )}

            {/* Filter tabs should be in a fixed position with z-index above main content */}
            <div className="sticky top-[60px] z-10 border-b border-gray-100">
              {children}
            </div>
          </main>
        </div>}

        {/* Right sidebar with ad banners - only visible on desktop */}
        {isDesktop && (
          <div className="w-[260px] fixed right-0 top-[60px] bottom-0 bg-white shadow-sm">
            <div className="sticky top-[70px] p-2 space-y-4 overflow-y-auto h-[calc(100vh-70px)] thin-scrollbar">
              {/* <AdBanner position="right_top" className="mb-4" /> */}
              <SidebarAds className="mb-4" />
            </div>
          </div>
        )}
      </div>}


    </div>
  );
};

export default ResponsiveLayout;
