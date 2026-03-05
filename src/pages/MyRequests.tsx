import { useState } from "react";
import RequestCard from "@/components/RequestCard";
import { useRequests } from "@/context/RequestsContext";
import { toast } from "@/hooks/use-toast";

const MyRequests = () => {
  const { requests, cancelRequest } = useRequests();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 py-4">
        <div className="mx-auto max-w-md">
          <h1 className="text-xl font-display font-bold">My Requests</h1>
        </div>
      </header>

      <div className="mx-auto max-w-md space-y-4 p-4">
        {requests.map((request) => (
          <div key={request.id} className="space-y-2">
            <RequestCard request={request} />
            {request.status !== "delivered" && (
              <button
                type="button"
                onClick={() => handleCancelRequest(request.id)}
                disabled={cancellingId === request.id}
                className="w-full rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-bold text-destructive transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancellingId === request.id ? "Cancelling..." : "Cancel Request"}
              </button>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground animate-fade-in">
            <span className="text-4xl mb-3">📭</span>
            <p className="font-display font-semibold">No requests yet</p>
            <p className="text-sm">Post your first request from the Home page!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
