import { useMediaQuery } from "@/hooks/use-media-query";
import { MoveUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const FilterTabs = ({ tabs, activeTab, onTabClick }: FilterTabsProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [hasCrossed60, setHasCrossed60] = useState(false);

  // useEffect(() => {
  //   document.addEventListener("scroll", () => {
  //     if (containerRef.current) {
  //       const rect = containerRef.current.getBoundingClientRect();
  //       // console.log("Element position relative to viewport:", {
  //       //   top: rect.top,
  //       //   right: rect.right,
  //       //   bottom: rect.bottom,
  //       //   left: rect.left,
  //       //   width: rect.width,
  //       //   height: rect.height,
  //       // });
  //       if (rect.top == 60) {
  //         setShowArrow(true);
  //       } else {
  //         setShowArrow(false);
  //       }
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();

        // Trigger when the element crosses 60px for the first time
        if (rect.top <= 60 && !hasCrossed60) {
          setShowArrow(true);
          console.log("ohello");
          setHasCrossed60(true); // Set flag to true so it doesn't log again
        } else if (rect.top > 60 && hasCrossed60) {
          setShowArrow(false); // Hide arrow if it's scrolled past 60px
          setHasCrossed60(false); // Reset flag if scrolled back above 60px
        }
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll); // Clean up event listener on unmount
    };
  }, [hasCrossed60]);

  return (
    <div
      className="filter-tabs-container border-b border-gray-100 md:px-0 bg-[#F9FAFB] flex items-center justify-between"
      ref={containerRef}
    >
      <div className="flex gap-2 px-4 md:px-0 overflow-x-auto thin-scrollbar py-3 md:py-4 bg-[#F9FAFB]">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`px-4 py-2 rounded-full cursor-pointer text-center font-medium ${
              activeTab === tab
                ? "bg-brand text-white"
                : "bg-gray-100 text-gray-800"
            } ${isMobile ? "text-sm" : "text-sm md:text-xs md:px-3 md:py-1.5"}`}
            onClick={() => onTabClick?.(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      {showArrow && (
        <div className="mr-5 flex items-center relative group sm:hidden">
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

          {/* Optional tooltip */}
          {/* <span className="
      absolute right-full top-1/2 -translate-y-1/2
      mr-2 px-2 py-1
      bg-gray-800 text-white text-xs
      rounded whitespace-nowrap
      opacity-0 group-hover:opacity-100
      transition-opacity duration-200
      pointer-events-none
    ">
      Scroll tabs
      <span className="absolute top-1/2 right-0 w-2 h-2 bg-gray-800 transform translate-x-1/2 -translate-y-1/2 rotate-45" />
    </span> */}
        </div>
      )}
    </div>
  );
};

export default FilterTabs;

// const FilterTabs = ({ tabs, activeTab, onTabClick }: FilterTabsProps) => {
//   const isMobile = useMediaQuery("(max-width: 767px)");

//   return (
//     <div className={`${isMobile? 'filter-tabs-container': 'fixed w-[610px] top-[63px]'} border-b border-gray-100 bg-background py-4 z-50`}>
//       <div className="flex gap-2 px-4 overflow-x-auto thin-scrollbar ">
//         {tabs.map((tab) => (
//           <div
//             key={tab}
//             className={`px-4 py-2 rounded-full cursor-pointer text-center font-medium ${
//               activeTab === tab
//                 ? "bg-brand text-white"
//                 : "bg-gray-100 text-gray-800"
//             } ${isMobile ? "text-sm" : "text-sm md:text-xs md:px-3 md:py-1.5"}`}
//             onClick={() => onTabClick?.(tab)}
//           >
//             {tab}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
