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

const PostRequest = () => {
  const navigate = useNavigate();
  const { addRequest } = useRequests();
  
  const [productName, setProductName] = useState("");
  const [storeId, setStoreId] = useState("");
  const [reward, setReward] = useState("3.00");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [isDelayed, setIsDelayed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Posted! 🎉",
      description: "Your neighbors will see your request shortly.",
    });
    navigate("/requests");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-card safe-bottom px-4 py-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-foreground p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold">Post a Request</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5 p-4 animate-fade-in">
        {/* Product */}
        <div className="space-y-2">
          <Label htmlFor="product" className="font-semibold">Product Name</Label>
          <Input 
            id="product" 
            placeholder="e.g. Oat Milk (Oatly)" 
            required 
            className="bg-card"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        {/* Photo placeholder */}
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 p-8 cursor-pointer hover:border-primary/40 transition-colors">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm font-medium">Add product photo (optional)</span>
          </div>
        </div>

        {/* Store */}
        <div className="space-y-2">
          <Label className="font-semibold">Store</Label>
          <Select value={storeId} onValueChange={setStoreId} required>
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
          <Label htmlFor="reward" className="font-display font-semibold">Reward</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
            <Input
              id="reward"
              type="number"
              step="0.50"
              min="1"
              defaultValue="3.00"
              className="pl-7 bg-card"
              required
            />
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
          <Label htmlFor="expiry" className="font-semibold">Deliver By</Label>
          <Input 
            id="expiry" 
            type="time" 
            required 
            className="bg-card"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          />
        </div>

        {/* Delivery Preference */}
        <div className="rounded-xl border border-border bg-card p-4 card-glow space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="font-semibold">Anti-Encounter Mode</Label>
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

        <Button type="submit" size="lg" disabled={loading} className="w-full rounded-lg font-bold text-sm h-12 gradient-electric">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Post Request
        </Button>
      </form>
    </div>
  );
};

export default PostRequest;

export type RequestStatus = "pending" | "completed" | "cancelled";

