import { GroceryRequest } from "@/types";
import { cn } from "@/lib/utils";
import { Clock, MapPin, HandCoins } from "lucide-react";
import StatusStepper from "./StatusStepper";

interface RequestCardProps {
  request: GroceryRequest;
}

const RequestCard = ({ request }: RequestCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-4 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-display font-bold text-base text-foreground">
            {request.productName}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{request.storeName}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-reward/15 px-3 py-1">
          <HandCoins className="h-3.5 w-3.5 text-reward" />
          <span className="text-sm font-bold text-reward-foreground">
            ${request.reward.toFixed(2)}
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
    </div>
  );
};

export default RequestCard;
