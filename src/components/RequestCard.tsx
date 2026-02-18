import { GroceryRequest } from "@/types";
import { cn } from "@/lib/utils";
import { Clock, MapPin, HandCoins, Map, MessageCircle, Zap, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusStepper from "./StatusStepper";

interface RequestCardProps {
  request: GroceryRequest;
}

const urgencyBadge = {
  normal: null,
  rush: { icon: <Zap className="h-3 w-3" />, label: "Rush", className: "bg-[hsl(var(--status-shopping))]/15 text-[hsl(var(--status-shopping))]" },
  urgent: { icon: <Flame className="h-3 w-3" />, label: "Urgent", className: "bg-destructive/15 text-destructive" },
};

const RequestCard = ({ request }: RequestCardProps) => {
  const navigate = useNavigate();
  const badge = urgencyBadge[request.urgency];

  return (
    <div className="glass-card rounded-2xl p-4 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-foreground">
              {request.productName}
            </h3>
            {badge && (
              <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold", badge.className)}>
                {badge.icon} {badge.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{request.storeName}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-reward/15 px-3 py-1">
          <HandCoins className="h-3.5 w-3.5 text-reward" />
          <span className="text-sm font-bold text-reward-foreground">
            ¥{request.reward}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>By {request.expiryTime}</span>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
          {request.deliveryPreference === "delayed" ? "🤫 Anti-Encounter" : "🤝 Direct"}
        </span>
      </div>

      <StatusStepper status={request.status} />

      {request.status === "shopping" && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <button
            onClick={() => navigate(`/tracking/${request.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-primary py-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
          >
            <Map className="h-3.5 w-3.5" /> Track
          </button>
          <button
            onClick={() => navigate(`/chat/${request.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-primary py-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
