import { RequestStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Clock, ShoppingCart, PackageCheck } from "lucide-react";

interface StatusStepperProps {
  status: RequestStatus;
}

const steps = [
  { key: "awaiting" as const, label: "Awaiting Neighbor", icon: Clock },
  { key: "shopping" as const, label: "Shopping", icon: ShoppingCart },
  { key: "delivered" as const, label: "Dropped Off", icon: PackageCheck },
];

const statusIndex = { awaiting: 0, shopping: 1, delivered: 2 };

const StatusStepper = ({ status }: StatusStepperProps) => {
  const currentIndex = statusIndex[status];

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => {
        const isActive = i <= currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                  isCurrent && "ring-2 ring-primary/30 ring-offset-2 ring-offset-card animate-pulse-soft"
                )}
              >
                <step.icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium text-center leading-tight",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded-full mx-1 mb-5 transition-colors",
                  i < currentIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusStepper;
