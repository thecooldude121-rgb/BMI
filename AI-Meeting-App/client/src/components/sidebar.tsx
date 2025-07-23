import { cn } from "@/lib/utils";
import { useLocation, Link } from "wouter";
import { 
  Home, 
  Upload, 
  BarChart3, 
  Settings, 
  Mic,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Meetings", href: "/meetings", icon: Mic },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MeetingAI</h1>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-50",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-primary" : "text-gray-400",
                      "mr-3 h-5 w-5"
                    )}
                  />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">john@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
