
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Image, 
  List, 
  LogOut, 
  Plus, 
  Settings, 
  TrendingUp, 
  User 
} from "lucide-react";

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
  
  const handleLogout = () => {
    // In a real app, this would properly log out the user
    localStorage.removeItem("scheduly-authenticated");
    window.location.href = "/";
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 overflow-y-auto py-6 flex flex-col">
      <div className="px-4 mb-8">
        <h1 className="text-2xl font-bold text-primary">Scheduly</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 mb-1 ${isActive ? "text-white" : ""}`}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 mt-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-gray-500 hover:text-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
