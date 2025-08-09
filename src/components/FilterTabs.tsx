import { useMediaQuery } from "@/hooks/use-media-query";

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const FilterTabs = ({ tabs, activeTab, onTabClick }: FilterTabsProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="filter-tabs-container border-b border-gray-100">
      <div className="flex gap-2 px-4 md:px-0 overflow-x-auto thin-scrollbar py-3 bg-background">
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
