import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ArrowLeft, ShoppingBag, ImagePlus } from "lucide-react";
import { mockStores } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const PostRequest = () => {
  const navigate = useNavigate();
  const [isDelayed, setIsDelayed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Posted! 🎉",
      description: "Your neighbors will see your request shortly.",
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

        {/* Reward */}
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

        <Button type="submit" size="lg" className="w-full rounded-2xl font-display font-bold text-base h-14">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Post Request
        </Button>
      </form>
    </div>
  );
};

export default PostRequest;
