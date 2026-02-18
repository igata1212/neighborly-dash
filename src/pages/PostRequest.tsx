import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ArrowLeft, ShoppingBag, ImagePlus, Zap, Clock, Flame } from "lucide-react";
import { mockStores } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { UrgencyLevel } from "@/types";

const PRICING = {
  base: 250,
  overweight3kg: 200,
  overweight10kg: 400,
  tip: 100,
  urgencyMultiplier: { normal: 1, rush: 1.3, urgent: 1.6 },
};

const urgencyOptions: { value: UrgencyLevel; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "normal", label: "Normal", icon: <Clock className="h-4 w-4" />, description: "Standard delivery" },
  { value: "rush", label: "Rush", icon: <Zap className="h-4 w-4" />, description: "+30% reward" },
  { value: "urgent", label: "Urgent", icon: <Flame className="h-4 w-4" />, description: "+60% reward" },
];

const PostRequest = () => {
  const navigate = useNavigate();
  const [isDelayed, setIsDelayed] = useState(false);
  const [urgency, setUrgency] = useState<UrgencyLevel>("normal");
  const [weightCategory, setWeightCategory] = useState<"basic" | "over3kg" | "over10kg">("basic");
  const [includeTip, setIncludeTip] = useState(false);

  const totalReward = useMemo(() => {
    let total = PRICING.base;
    if (weightCategory === "over3kg") total += PRICING.overweight3kg;
    if (weightCategory === "over10kg") total += PRICING.overweight10kg;
    total = Math.round(total * PRICING.urgencyMultiplier[urgency]);
    if (includeTip) total += PRICING.tip;
    return total;
  }, [urgency, weightCategory, includeTip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Posted! 🎉",
      description: `Your neighbors will see your ¥${totalReward} request shortly.`,
    });
    navigate("/requests");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-foreground p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-display font-bold">Post a Request</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5 p-4 animate-fade-in">
        {/* Product */}
        <div className="space-y-2">
          <Label htmlFor="product" className="font-display font-semibold">Product Name</Label>
          <Input id="product" placeholder="e.g. Oat Milk (Oatly)" required className="bg-card" />
        </div>

        {/* Photo placeholder */}
        <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50 p-8 cursor-pointer hover:border-primary/40 transition-colors">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm font-medium">Add product photo (optional)</span>
          </div>
        </div>

        {/* Store */}
        <div className="space-y-2">
          <Label className="font-display font-semibold">Store</Label>
          <Select required>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select a store" />
            </SelectTrigger>
            <SelectContent>
              {mockStores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.icon} {s.name} — {s.distance}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Urgency Level */}
        <div className="space-y-2">
          <Label className="font-display font-semibold">Urgency Level</Label>
          <div className="grid grid-cols-3 gap-2">
            {urgencyOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setUrgency(opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-all",
                  urgency === opt.value
                    ? opt.value === "urgent"
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : opt.value === "rush"
                        ? "border-[hsl(var(--status-shopping))] bg-[hsl(var(--status-shopping))]/10 text-[hsl(var(--status-shopping))]"
                        : "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                )}
              >
                {opt.icon}
                <span className="text-xs font-bold">{opt.label}</span>
                <span className="text-[10px] opacity-75">{opt.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weight Category */}
        <div className="space-y-2">
          <Label className="font-display font-semibold">Weight Category</Label>
          <Select value={weightCategory} onValueChange={(v) => setWeightCategory(v as typeof weightCategory)}>
            <SelectTrigger className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic (under 3kg) — ¥{PRICING.base}</SelectItem>
              <SelectItem value="over3kg">Overweight 3kg+ — +¥{PRICING.overweight3kg}</SelectItem>
              <SelectItem value="over10kg">Overweight 10kg+ — +¥{PRICING.overweight10kg}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expiry */}
        <div className="space-y-2">
          <Label htmlFor="expiry" className="font-display font-semibold">Deliver By</Label>
          <Input id="expiry" type="time" required className="bg-card" />
        </div>

        {/* Delivery Preference */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="font-display font-semibold">Anti-Encounter Mode</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[220px] text-xs">
                  A 5-minute delayed drop-off so you can grab your items without an awkward doorstep chat. 🤫
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch checked={isDelayed} onCheckedChange={setIsDelayed} />
          </div>
          <p className="text-xs text-muted-foreground">
            {isDelayed
              ? "Your neighbor will leave the item at your door and notify you 5 minutes later."
              : "Your neighbor will hand the item to you directly."}
          </p>
        </div>

        {/* Thanks Tip */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-display font-semibold">Thanks Tip 🙏</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Add ¥{PRICING.tip} as a thank-you</p>
            </div>
            <Switch checked={includeTip} onCheckedChange={setIncludeTip} />
          </div>
        </div>

        {/* Price Summary */}
        <div className="glass-card rounded-2xl p-4 space-y-2">
          <h3 className="font-display font-bold text-sm">Price Breakdown</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base delivery</span>
              <span>¥{PRICING.base}</span>
            </div>
            {weightCategory !== "basic" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overweight surcharge</span>
                <span>+¥{weightCategory === "over3kg" ? PRICING.overweight3kg : PRICING.overweight10kg}</span>
              </div>
            )}
            {urgency !== "normal" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Urgency ({urgency})</span>
                <span>×{PRICING.urgencyMultiplier[urgency]}</span>
              </div>
            )}
            {includeTip && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thanks tip</span>
                <span>+¥{PRICING.tip}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span>Total Reward</span>
              <span className="text-[hsl(var(--reward-foreground))]">¥{totalReward}</span>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full rounded-2xl font-display font-bold text-base h-14">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Post Request — ¥{totalReward}
        </Button>
      </form>
    </div>
  );
};

export default PostRequest;
