import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Building2, Briefcase, Store, Car, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Facebook, Youtube, Instagram } from 'lucide-react';
import { useListing } from "@/context/ListingContext";


const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
  </svg>
);



const socialIcons = [
  { icon: <XIcon className="w-4 h-4 text-white" />, link: 'https://x.com/desieasyteam' },
  { icon: <Facebook className="w-4 h-4 text-white" />, link: 'https://www.facebook.com/desieasy' },
  { icon: <Youtube className="w-4 h-4 text-white" />, link: 'https://www.youtube.com/@desieasy' },
  { icon: <Instagram className="w-4 h-4 text-white" />, link: 'https://www.instagram.com/desieasyofficial/' },
];



interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { setCategory, setIsUsa, setSubCategory} = useListing();
  const navigate = useNavigate();
  // This is a placeholder for real authentication logic
  // In a real app, you would check if the user has employee or admin role
  const isEmployee =
    user && (user.email?.includes("admin") || user.email?.includes("employee"));
  const isAdmin = user && user.email?.includes("admin");

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Store, label: "Marketplace", path: "/marketplace" },
    { icon: Car, label: "Rides", path: "/rides" },
    { icon: Building2, label: "Accommodations", path: "/accommodations" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
  ];

  const handleSetCategory = (menu: string) => {

    if (menu === "Marketplace") {
      setCategory("MARKETPLACE");
      setIsUsa(false);
      setSubCategory("");

    } else if (menu === "Rides") {
      setCategory("RIDES");
      setIsUsa(false);
      setSubCategory("");
    } else if (menu === "Accommodations") {
      setCategory("ACCOMMODATIONS");
      setIsUsa(false);
      setSubCategory("");
    }
    else if (menu === "Jobs") {
      setCategory("JOBS");
      setIsUsa(false);
      setSubCategory("");
    } else {
      setCategory("/");
      setIsUsa(false);
      setSubCategory("");
    }

    
  }

  // Admin/Employee menu items - only visible to employees or admins
  const adminMenuItems = [
    ...(isAdmin ? [{ icon: Users, label: "Admin Panel", path: "/admin" }] : []),
    ...(isEmployee
      ? [{ icon: Users, label: "Employee Panel", path: "/employee" }]
      : []),
  ];

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath.includes("/marketplace")) {
      setCategory("MARKETPLACE");
      setIsUsa(false);
      setSubCategory("");
    } else if (currentPath.includes("/rides")) {
      setCategory("RIDES");
      setIsUsa(false);
      setSubCategory("");
    } else if (currentPath.includes("/accommodations")) {
      setCategory("ACCOMMODATIONS");
      setIsUsa(false);
      setSubCategory("");
    } else if (currentPath.includes("/jobs")) {
      setCategory("JOBS");
      setIsUsa(false);
      setSubCategory("");
    } else {
      setCategory("");
      setIsUsa(false);
      setSubCategory("");
    }
  }, [location.pathname, setCategory, setIsUsa, setSubCategory]);


  return (
    <aside className={`h-full ${collapsed ? "w-[70px]" : "w-[240px]"}`}>
      <div className="flex flex-col h-full py-4">
        <nav className="flex-1 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleSetCategory(item.label)}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                  ? "bg-gray-100 text-black"
                  : "text-gray-700 hover:bg-gray-100"
                  } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-brand" : "text-gray-500"
                    }`}
                />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}

          {/* Admin/Employee menu items */}
          {(isAdmin || isEmployee) && adminMenuItems.length > 0 && (
            <>
              {!collapsed && <div className="mx-3 my-4 h-px bg-gray-200" />}

              {adminMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                      ? "bg-gray-100 text-black"
                      : "text-gray-700 hover:bg-gray-100"
                      } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-brand" : "text-gray-500"
                        }`}
                    />
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </div>
      <div className="fixed bottom-5 left-4 hidden xl:block">

        {/* icons for x, facebook, youtube instagram */}
        <div className="flex justify-center gap-2 py-4">
          {socialIcons.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-500 hover:bg-gray-700 p-2 transition-all duration-300"
            >
              {item.icon}
            </a>
          ))}
        </div>

        <div className="flex  gap-2">
          <p
            onClick={() => navigate("/privacy-policy")}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            Privacy Policy
          </p>
          <p
            onClick={() => {
              navigate("/user-agreement");
            }}
            className="text-xs text-gray-500 hover:underline cursor-pointer"
          >
            User Agreement
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Desieasy © 2025. All rights reserved.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
