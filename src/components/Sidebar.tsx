import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Building2, Briefcase, Store, Car, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  const { user } = useAuth();
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

  // Admin/Employee menu items - only visible to employees or admins
  const adminMenuItems = [
    ...(isAdmin ? [{ icon: Users, label: "Admin Panel", path: "/admin" }] : []),
    ...(isEmployee
      ? [{ icon: Users, label: "Employee Panel", path: "/employee" }]
      : []),
  ];

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
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-gray-100 text-black"
                    : "text-gray-700 hover:bg-gray-100"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-brand" : "text-gray-500"
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
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-gray-100 text-black"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? "text-brand" : "text-gray-500"
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
