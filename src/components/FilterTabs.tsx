import { useMediaQuery } from "@/hooks/use-media-query";
import { MoveUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
  tabsList?: {
    label: string;
    url: string;
  }[];
  isTab?: boolean;
}

const FilterTabs = ({
  tabs,
  activeTab,
  onTabClick,
  tabsList,
  isTab,
}: FilterTabsProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [hasCrossed60, setHasCrossed60] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      if (scrollPosition > 200) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }

      //console.log(document.documentElement.scrollTop);
    });
  }, []);

  return (
    <div
      className="filter-tabs-container border-b border-gray-100 md:px-2 bg-[#F9FAFB] flex items-center justify-between z-[60]"
      ref={containerRef}
    >
      <div className="flex gap-2 px-4 md:px-0 overflow-x-auto thin-scrollbar py-3 md:py-4 bg-[#F9FAFB]">
        {isTab
          ? tabs.map((tab) => (
              <div
                key={tab}
                className={`px-4 py-2 rounded-full cursor-pointer text-center font-medium ${
                  activeTab === tab
                    ? "bg-brand text-white"
                    : "bg-gray-100 text-gray-800"
                } ${
                  isMobile ? "text-sm" : "text-sm md:text-xs md:px-3 md:py-1.5"
                }`}
                onClick={() => onTabClick?.(tab)}
              >
                {tab}
              </div>
            ))
          : tabsList.map((tab, idx) => (
              <Link
                to={tab.url}
                key={idx}
                className={`px-4 py-2 rounded-full cursor-pointer text-center font-medium ${
                  activeTab === tab.label
                    ? "bg-brand text-white"
                    : "bg-gray-100 text-gray-800"
                } ${
                  isMobile ? "text-sm" : "text-sm md:text-xs md:px-3 md:py-1.5"
                }`}
              >
                {tab.label}
              </Link>
            ))}
      </div>

      {/* This is filter top with arrow */}
      <div
        className={`mr-5 flex items-center relative group sm:hidden ${
          !showArrow ? "hidden" : ""
        }`}
      >
        <button
          className="p-2 rounded-sm 
        bg-brand border border-[bg-brand]
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-brand/50
        flex items-center justify-center 
        w-8 h-8"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          aria-label="Scroll tabs"
        >
          <MoveUp className="w-5 h-5 text-white transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};

export default FilterTabs;
