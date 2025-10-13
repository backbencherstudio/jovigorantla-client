// src/layouts/MainLayout.tsx
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";
import SidebarAds from "../ui/Sidebar-Ads";
import CategoryIcons from "../CategoryIcons";
import LocationWithRadius from "../LocationWithRedius";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import FilterTabs from "../FilterTabs";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const leftSidebarWidth = isDesktop ? "240px" : isTablet ? "70px" : "0px";
  const rightSidebarWidth = isDesktop ? "300px" : "0px";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1">
        {!isMobile && (
          <div className="fixed left-0 top-[60px] h-[calc(100vh-60px)] overflow-y-auto z-10 bg-white shadow-sm">
            <Sidebar collapsed={isTablet} />
          </div>
        )}
        <div className="flex-1">
          {/* Mobile Search Header */}
          {isMobile && (
            <div className="z-10 transition-transform bg-white px-4 pt-2 pb-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // onSearchSubmit(searchInput);
                }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search"
                    value={""}
                    onChange={(e) => {}}
                    className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none h-10"
                  />
                </div>
              </form>
              <div className="mt-2 mr-[-18px] flex items-center justify-end">
                <LocationWithRadius popupStyle="mr-2" />
              </div>
              <div className="pb-2">
                <CategoryIcons />
              </div>
            </div>
          )}

          <div
            className="flex-1"
            style={{
              marginLeft: !isMobile ? leftSidebarWidth : "0",
              marginRight: isDesktop ? rightSidebarWidth : "0",
            }}
          >
            {children}
          </div>
        </div>
        {isDesktop && (
          <div className="w-[260px] fixed right-0 top-[60px] bottom-0 bg-white shadow-sm">
            <div className="sticky top-[70px] p-2 space-y-4 overflow-y-auto h-[calc(100vh-70px)] thin-scrollbar">
              <SidebarAds className="mb-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// // // components/MainLayout.tsx
// import { ReactNode } from 'react';
// import { useIsMobile } from '@/hooks/use-mobile';
// import Header from '../Header';
// import { Search } from 'lucide-react';
// import { Input } from '../ui/input';
// import LocationWithRadius from '../LocationWithRedius';
// import CategoryIcons from '../CategoryIcons';
// import FilterTabs from '../FilterTabs';
// import Sidebar from "@/components/Sidebar";
// import { useMediaQuery } from '@/hooks/use-media-query';
// import SidebarAds from '../ui/Sidebar-Ads';

// interface MainLayoutProps {
//   children: ReactNode;
//   searchInput: string;
//   onSearchChange: (value: string) => void;
//   onSearchSubmit: (value: string) => void;
//   activeFilter: string;
//   onFilterClick: (filter: string) => void;
// }

// export default function MainLayout({
//   children,
//   searchInput,
//   onSearchChange,
//   onSearchSubmit,
//   activeFilter,
//   onFilterClick
// }: MainLayoutProps) {
//   const isMobile = useIsMobile();
//     const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
//   const isDesktop = useMediaQuery("(min-width: 1024px)");

//   const leftSidebarWidth = isDesktop ? "240px" : isTablet ? "70px" : "0px";
//   const rightSidebarWidth = isDesktop ? "300px" : "0px";

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Header
//         searchInput={searchInput}
//         onSearchInputChange={onSearchChange}
//         onSearchSubmit={onSearchSubmit}
//       />

//       <div className="flex flex-1">
//         {/* Desktop Sidebar */}
//         {!isMobile && (
//           <div className="fixed left-0 top-[60px] h-[calc(100vh-60px)] overflow-y-auto z-10 bg-white shadow-sm">
//             <Sidebar collapsed={ isTablet} />
//           </div>
//         )}

//         <div className="flex-1">
//           {/* Mobile Search Header */}
//           {isMobile && (
//             <div className="z-10 transition-transform bg-white px-4 pt-2 pb-2">
//               <form onSubmit={(e) => {
//                 e.preventDefault();
//                 onSearchSubmit(searchInput);
//               }}>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <Input
//                     type="text"
//                     placeholder="Search"
//                     value={searchInput}
//                     onChange={(e) => onSearchChange(e.target.value)}
//                     className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none h-10"
//                   />
//                 </div>
//               </form>
//               <div className="mt-2 mr-[-18px] flex items-center justify-end">
//                 <LocationWithRadius popupStyle="mr-2" />
//               </div>
//               <div className="pb-2">
//                 <CategoryIcons />
//               </div>
//             </div>
//           )}

//           {/* Filter Tabs (Common for all devices) */}
//           {/* <div className="sticky top-[60px] z-10 border-b border-gray-100 bg-[#F9FAFB]">
//             <FilterTabs
//               tabs={["All", "Available", "Looking"]}
//               activeTab={activeFilter}
//               onTabClick={onFilterClick}
//             />
//           </div> */}

//           {/* Page Content */}

//           <div
//           className="flex-1"
//           style={{
//             marginLeft: !isMobile ? leftSidebarWidth : "0",
//             marginRight: isDesktop ? rightSidebarWidth : "0",
//           }}
//         >
//           {children}
//         </div>

//           {/* Desktop Right Sidebar */}
//           {isDesktop && (
//           <div className="w-[260px] fixed right-0 top-[60px] bottom-0 bg-white shadow-sm">
//             <div className="sticky top-[70px] p-2 space-y-4 overflow-y-auto h-[calc(100vh-70px)] thin-scrollbar">
//               <SidebarAds className="mb-4" />
//             </div>
//           </div>
//         )}
//         </div>
//       </div>
//     </div>
//   );
// }
