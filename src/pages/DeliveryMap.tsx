import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const MOCK_ROUTE = [
  { lat: 35.681, lng: 139.767, label: "Store" },
  { lat: 35.682, lng: 139.766, label: "En route" },
  { lat: 35.684, lng: 139.764, label: "Nearby" },
  { lat: 35.685, lng: 139.763, label: "Your location" },
];

const DeliveryMap = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < MOCK_ROUTE.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentLocation = MOCK_ROUTE[currentStep];
  const progress = ((currentStep + 1) / MOCK_ROUTE.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-foreground p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-display font-bold">Live Tracking</h1>
        </div>
      </header>

      <div className="mx-auto max-w-md p-4 space-y-4 animate-fade-in">
        {/* Mock Map */}
        <div className="relative rounded-2xl overflow-hidden bg-accent/30 border border-border h-72">
          {/* Grid background to simulate a map */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Destination marker */}
          <div className="absolute bottom-6 right-8 flex flex-col items-center animate-pulse">
            <MapPin className="h-8 w-8 text-primary fill-primary/20" />
            <span className="text-[10px] font-bold bg-card/90 px-2 py-0.5 rounded-full mt-1 text-foreground">Your Home</span>
          </div>

          {/* Delivery person marker - moves based on step */}
          <div
            className="absolute flex flex-col items-center transition-all duration-1000 ease-in-out"
            style={{
              top: `${20 + currentStep * 15}%`,
              left: `${15 + currentStep * 12}%`,
            }}
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--status-shopping))] flex items-center justify-center shadow-lg">
                <Navigation className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-[hsl(var(--status-delivered))] rounded-full border-2 border-card animate-pulse" />
            </div>
            <span className="text-[10px] font-bold bg-card/90 px-2 py-0.5 rounded-full mt-1 text-foreground">
              Taro 🛒
            </span>
          </div>

          {/* Store marker */}
          <div className="absolute top-6 left-8 flex flex-col items-center">
            <span className="text-2xl">🏪</span>
            <span className="text-[10px] font-bold bg-card/90 px-2 py-0.5 rounded-full mt-1 text-foreground">Fresh Mart</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-display font-bold text-foreground">Delivery Progress</span>
            <span className="text-muted-foreground">{currentLocation.label}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Deliver info card */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-xl">
              🧑
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-foreground">Taro</h3>
              <p className="text-xs text-muted-foreground">Your deliver • 4.9 ⭐ • 47 deliveries</p>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full h-10 w-10"
              onClick={() => navigate("/chat/1")}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* ETA card */}
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Estimated arrival</p>
          <p className="text-3xl font-display font-extrabold text-foreground mt-1">
            {currentStep >= MOCK_ROUTE.length - 1 ? "Arrived! 🎉" : `${(MOCK_ROUTE.length - 1 - currentStep) * 3} min`}
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full rounded-2xl font-display font-bold"
          onClick={() => navigate("/chat/1")}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat with Taro
        </Button>
      </div>
    </div>
  );
};

export default DeliveryMap;
