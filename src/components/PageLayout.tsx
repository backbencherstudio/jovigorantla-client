import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdBanner from "@/components/AdBanner";
import SidebarAds from "./ui/Sidebar-Ads";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  hideBackButton?: boolean;
  fullWidth?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  hideBackButton = false,
  fullWidth = false,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const navigate = useNavigate();
  const location = useLocation();

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

  // Calculate the left sidebar width based on device
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
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
          className="flex-1"
          style={{
            marginLeft: !isMobile ? leftSidebarWidth : "0",
            marginRight: isDesktop ? rightSidebarWidth : "0",
            marginTop: "0",
          }}
        >
          {/* Center Content Container */}
          <main
            className={`w-full mx-auto ${
              fullWidth ? "" : "max-w-3xl"
            } bg-white h-full flex flex-col`}
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
        </div>

        {/* Right sidebar with ad banners - always visible on desktop */}
        {isDesktop && (
          <div className="w-[260px] fixed right-0 top-[60px] bottom-0 bg-white shadow-sm">
            <div className="sticky top-[70px] p-4 space-y-4">
              {/* <AdBanner position="right_top" className="mb-4" /> */}
              <SidebarAds className="mb-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLayout;
