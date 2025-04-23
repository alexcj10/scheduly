
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Image, 
  List, 
  LogOut, 
  Menu,
  Plus, 
  Settings, 
  TrendingUp, 
  User 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: <List className="h-5 w-5" /> },
  { title: "Create Post", path: "/create", icon: <Plus className="h-5 w-5" /> },
  { title: "Calendar", path: "/calendar", icon: <Calendar className="h-5 w-5" /> },
  { title: "Analytics", path: "/analytics", icon: <TrendingUp className="h-5 w-5" /> },
  { title: "Media Library", path: "/media", icon: <Image className="h-5 w-5" /> },
  { title: "Account", path: "/account", icon: <User className="h-5 w-5" /> },
  { title: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> }
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("scheduly-authenticated");
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 lg:hidden"
        aria-label="Toggle navigation"
      >
        <Menu className="h-6 w-6" />
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out transform",
        "lg:translate-x-0",
        {
          "-translate-x-full": isCollapsed,
          "translate-x-0": !isCollapsed
        }
      )}>
        <div className="flex flex-col h-full">
          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">Scheduly</h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="block">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 mb-1 transition-all duration-200",
                      isActive ? "text-white" : "",
                      "hover:translate-x-1"
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 mt-auto border-t border-gray-100">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
