import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ArrowLeft, ShoppingBag } from "lucide-react";
import { mockStores } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { useRequests } from "@/context/RequestsContext";
import { toast } from "@/hooks/use-toast";

const PRICING = {
  base: 250,
  weightSurcharge: 200,
  multiItemSurcharge: 100,
  distanceTroubleSurcharge: 150,
  tip: 100,
  neighborFeeRate: 0.2,
};

const formatCartProductName = (
  items: Array<{ product: { name: string; brand?: string | null } }>
): string => {
  if (items.length === 0) {
    return "Grocery request";
  }

  const first = items[0].product;
  const firstLabel = first.brand ? `${first.name} (${first.brand})` : first.name;

  if (items.length === 1) {
    return firstLabel;
  }

  return `${firstLabel} + ${items.length - 1} more item${items.length > 2 ? "s" : ""}`;
};

const PostRequest = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { addRequest } = useRequests();

  const [selectedStore, setSelectedStore] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [isDelayed, setIsDelayed] = useState(false);
  const [weightSurcharge, setWeightSurcharge] = useState(false);
  const [distanceTrouble, setDistanceTrouble] = useState(false);
  const [includeTip, setIncludeTip] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length > 0 && !selectedStore) {
      const firstProductStores = items[0].product.storeIds;
      if (firstProductStores.length > 0) {
        setSelectedStore(firstProductStores[0]);
      }
    }
  }, [items, selectedStore]);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/post", { replace: true });
    }
  }, [items.length, navigate]);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const productTotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0),
    [items]
  );

  const rescueReward = useMemo(() => {
    let total = PRICING.base;
    if (weightSurcharge) total += PRICING.weightSurcharge;
    if (itemCount >= 3) total += PRICING.multiItemSurcharge;
    if (distanceTrouble) total += PRICING.distanceTroubleSurcharge;
    if (includeTip) total += PRICING.tip;
    return total;
  }, [weightSurcharge, itemCount, distanceTrouble, includeTip]);

  const neighborFee = Math.round(rescueReward * PRICING.neighborFeeRate);
  const userPaysTotal = productTotal + rescueReward + neighborFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStore || !deliveryTime) {
      toast({
        title: "Missing fields",
        description: "Please select a store and delivery time.",
        variant: "destructive",
      });
      return;
    }

    const store = mockStores.find((item) => item.id === selectedStore);
    if (!store) {
      toast({
        title: "Store not found",
        description: "Please choose a valid store.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await addRequest({
        productName: formatCartProductName(items),
        storeName: store.name,
        reward: rescueReward,
        expiryTime: deliveryTime,
        deliveryPreference: isDelayed ? "delayed" : "direct",
      });

      clearCart();
      toast({
        title: "Request Posted",
        description: `Your neighbors can now accept this request. Total: $${(userPaysTotal / 100).toFixed(2)}`,
      });
      navigate("/requests");
    } catch (error) {
      console.error("Error posting request:", error);
      toast({
        title: "Failed to post request",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button onClick={() => navigate("/post")} className="text-foreground p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-display font-bold">Checkout</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5 p-4 animate-fade-in">
        <div className="glass-card rounded-2xl p-4 space-y-2">
          <h3 className="font-display font-bold text-sm">Items in your request</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between">
                <span>
                  {product.brand ? `${product.name} (${product.brand})` : product.name}
                  {quantity > 1 && ` x ${quantity}`}
                </span>
                {product.price != null && <span>${(product.price * quantity / 100).toFixed(2)}</span>}
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground">
            <span>Product total</span>
            <span>${(productTotal / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-display font-semibold">Store</Label>
          <Select value={selectedStore} onValueChange={setSelectedStore} required>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select a store" />
            </SelectTrigger>
            <SelectContent>
              {mockStores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.icon} {store.name} - {store.distance}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="font-display font-semibold">Weight surcharge</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[240px] text-xs">
                  For heavy items (water 2Lx6, rice 5kg, soil, etc.) +${(PRICING.weightSurcharge / 100).toFixed(2)}
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch checked={weightSurcharge} onCheckedChange={setWeightSurcharge} />
          </div>
          {weightSurcharge && (
            <p className="text-xs text-muted-foreground mt-1">+${(PRICING.weightSurcharge / 100).toFixed(2)}</p>
          )}
        </div>

        {itemCount >= 3 && (
          <div className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-muted-foreground">
            Multi-item surcharge (3+ items) +${(PRICING.multiItemSurcharge / 100).toFixed(2)}
          </div>
        )}

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="font-display font-semibold">Distance / trouble surcharge</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[240px] text-xs">
                  For rainy days or stores that are farther away +${(PRICING.distanceTroubleSurcharge / 100).toFixed(2)}
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch checked={distanceTrouble} onCheckedChange={setDistanceTrouble} />
          </div>
          {distanceTrouble && (
            <p className="text-xs text-muted-foreground mt-1">+${(PRICING.distanceTroubleSurcharge / 100).toFixed(2)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry" className="font-display font-semibold">Deliver By</Label>
          <Input
            id="expiry"
            type="time"
            required
            className="bg-card"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          />
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="font-display font-semibold">Anti-Encounter Mode</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[220px] text-xs">
                  A 5-minute delayed drop-off so you can grab your items without an awkward doorstep chat.
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

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-display font-semibold">Thanks tip</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Add ${(PRICING.tip / 100).toFixed(2)} as a thank-you</p>
            </div>
            <Switch checked={includeTip} onCheckedChange={setIncludeTip} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 space-y-2">
          <h3 className="font-display font-bold text-sm">Price breakdown</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product total</span>
              <span>${(productTotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base fee</span>
              <span>${(PRICING.base / 100).toFixed(2)}</span>
            </div>
            {weightSurcharge && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight surcharge</span>
                <span>+${(PRICING.weightSurcharge / 100).toFixed(2)}</span>
              </div>
            )}
            {itemCount >= 3 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Multi-item (3+ items)</span>
                <span>+${(PRICING.multiItemSurcharge / 100).toFixed(2)}</span>
              </div>
            )}
            {distanceTrouble && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance / trouble</span>
                <span>+${(PRICING.distanceTroubleSurcharge / 100).toFixed(2)}</span>
              </div>
            )}
            {includeTip && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thanks tip</span>
                <span>+${(PRICING.tip / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Rescue reward (to carrier)</span>
              <span className="font-bold">${(rescueReward / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Neighbor fee (20%)</span>
              <span>${(neighborFee / 100).toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">${(userPaysTotal / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="w-full rounded-2xl font-display font-bold text-base h-14">
          <ShoppingBag className="h-5 w-5 mr-2" />
          {loading ? "Posting..." : `Post Request - $${(userPaysTotal / 100).toFixed(2)}`}
        </Button>
      </form>
    </div>
  );
};

export default PostRequest;
