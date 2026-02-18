import { mockRequests } from "@/data/mockData";
import RequestCard from "@/components/RequestCard";

const MyRequests = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 py-4">
        <div className="mx-auto max-w-md">
          <h1 className="text-xl font-display font-bold">My Requests</h1>
        </div>
      </header>

      <div className="mx-auto max-w-md space-y-4 p-4">
        {mockRequests.map((req) => (
          <RequestCard key={req.id} request={req} />
        ))}

        {mockRequests.length === 0 && (
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
