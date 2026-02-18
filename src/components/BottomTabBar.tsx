import { Home, ClipboardList, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/requests", icon: ClipboardList, label: "My Requests" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomTabBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs font-medium transition-colors rounded-xl",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn("p-1.5 rounded-xl transition-colors", isActive && "bg-accent")}>
                  <tab.icon className="h-5 w-5" />
                </div>
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomTabBar;
