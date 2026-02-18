import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockStores, mockRequests } from "@/data/mockData";
import StoreChip from "@/components/StoreChip";
import RequestCard from "@/components/RequestCard";
import heroImage from "@/assets/hero-neighborhood.png";

const Index = () => {
  const navigate = useNavigate();
  const activeRequests = mockRequests.filter((r) => r.status !== "delivered");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={heroImage}
          alt="Neighborhood illustration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-display font-extrabold text-foreground drop-shadow-sm">
            Hey, Neighbor! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Need something from the store?
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 space-y-6">
        {/* Nearby Stores */}
        <section className="animate-fade-in">
          <h2 className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Nearby Stores
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {mockStores.map((store) => (
              <StoreChip key={store.id} store={store} />
            ))}
          </div>
        </section>

        {/* Post button */}
        <Button
          onClick={() => navigate("/post")}
          size="lg"
          className="w-full rounded-2xl font-display font-bold text-base h-14 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Post a New Request
        </Button>

        {/* Active Requests */}
        <section className="space-y-3">
          <h2 className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wider">
            Your Active Requests ({activeRequests.length})
          </h2>
          {activeRequests.length > 0 ? (
            activeRequests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))
          ) : (
            <div className="flex flex-col items-center py-10 text-center text-muted-foreground animate-fade-in">
              <span className="text-3xl mb-2">🛒</span>
              <p className="text-sm">No active requests — post one above!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
