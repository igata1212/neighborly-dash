import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockStores } from "@/data/mockData";
import StoreChip from "@/components/StoreChip";
import RequestCard from "@/components/RequestCard";
import heroImage from "@/assets/hero-neighborhood.png";
import { useRequests } from "@/context/RequestsContext";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { requests, cancelRequest } = useRequests();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const activeRequests = requests.filter((request) => request.status !== "delivered");

  const handleCancelRequest = async (requestId: string) => {
    const confirmed = window.confirm("Cancel this request? Neighbors will no longer see it.");
    if (!confirmed) return;

    try {
      setCancellingId(requestId);
      await cancelRequest(requestId);
      toast({
        title: "Request canceled",
        description: "Your request was removed successfully.",
      });
    } catch (error) {
      console.error("Error canceling request:", error);
      toast({
        title: "Failed to cancel",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancellingId((current) => (current === requestId ? null : current));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
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

        <Button
          onClick={() => navigate("/post")}
          size="lg"
          className="w-full rounded-2xl font-display font-bold text-base h-14 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Post a New Request
        </Button>

        <section className="space-y-3">
          <h2 className="text-sm font-display font-bold text-muted-foreground uppercase tracking-wider">
            Your Active Requests ({activeRequests.length})
          </h2>
          {activeRequests.length > 0 ? (
            activeRequests.map((request) => (
              <div key={request.id} className="space-y-2">
                <RequestCard request={request} />
                <button
                  type="button"
                  onClick={() => handleCancelRequest(request.id)}
                  disabled={cancellingId === request.id}
                  className="w-full rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-bold text-destructive transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancellingId === request.id ? "Cancelling..." : "Cancel Request"}
                </button>
              </div>
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
