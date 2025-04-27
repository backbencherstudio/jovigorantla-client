import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdBanner from "@/components/AdBanner";

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
    navigate(-1);
  };

  // Calculate the left sidebar width based on device
  const leftSidebarWidth = isDesktop ? "240px" : isTablet ? "70px" : "0px";
  const rightSidebarWidth = isDesktop ? "300px" : "0px";

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
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
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
            )}

            {/* Page Content */}
            <div className="flex-1 h-full bg-white">{children}</div>
          </main>
        </div>

        {/* Right sidebar with ad banners - always visible on desktop */}
        {isDesktop && (
          <div className="w-[260px] fixed right-0 top-[60px] bottom-0 bg-white shadow-sm">
            <div className="sticky top-[70px] p-4 space-y-4">
              <AdBanner position="right_top" className="mb-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLayout;
