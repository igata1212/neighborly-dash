import { User, MapPin, Star, Settings, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 py-4">
        <div className="mx-auto max-w-md">
          <h1 className="text-xl font-display font-bold">Profile</h1>
        </div>
      </header>

      <div className="mx-auto max-w-md p-4 space-y-6 animate-fade-in">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent">
            <User className="h-10 w-10 text-accent-foreground" />
          </div>
          <div className="text-center">
            <h2 className="font-display font-bold text-lg">Alex Johnson</h2>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>Maple Street, Unit 4B</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Requests", value: "12" },
            { label: "Helped", value: "8" },
            { label: "Rating", value: "4.9", icon: Star },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl py-3">
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl font-display font-bold text-foreground">{stat.value}</span>
                {stat.icon && <stat.icon className="h-4 w-4 text-reward fill-reward" />}
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Menu */}
        <div className="space-y-1">
          {["Address Settings", "Payment Methods", "Notification Preferences", "Help & Support"].map(
            (item) => (
              <button
                key={item}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <span>{item}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
