import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { GroceryRequest } from "@/types";
import { mockRequests as initialMockRequests } from "@/data/mockData";

interface RequestsContextType {
  requests: GroceryRequest[];
  addRequest: (request: Omit<GroceryRequest, "id" | "createdAt" | "createdAtTimestamp">) => void;
  deleteRequest: (id: string) => void;
  cancelRequest: (id: string) => void;
  updateRequestStatus: (id: string, status: GroceryRequest["status"]) => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<GroceryRequest[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Load requests from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("requests");
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch {
        setRequests(initialMockRequests);
      }
    } else {
      setRequests(initialMockRequests);
    }
  }, []);

  // Save to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  // Set up auto-expiry timers for each request
  useEffect(() => {
    requests.forEach((request) => {
      // Skip if timer already exists or request is delivered
      if (timersRef.current.has(request.id) || request.status === "delivered") return;

      const timeUntilExpiry = request.createdAtTimestamp + 60 * 60 * 1000 - Date.now();

      if (timeUntilExpiry <= 0) {
        // Already expired, delete immediately
        deleteRequest(request.id);
      } else {
        // Set timer to auto-delete after expiry
        const timer = setTimeout(() => {
          deleteRequest(request.id);
        }, timeUntilExpiry);

        timersRef.current.set(request.id, timer);
      }
    });

    // Cleanup: clear timers for deleted requests
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, [requests]);

  const addRequest = (request: Omit<GroceryRequest, "id" | "createdAt" | "createdAtTimestamp">) => {
    const newRequest: GroceryRequest = {
      ...request,
      id: `${Date.now()}`,
      createdAt: "just now",
      createdAtTimestamp: Date.now(),
    };
    setRequests((prev) => [newRequest, ...prev]);
  };

  const deleteRequest = (id: string) => {
    // Clear timer if exists
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const cancelRequest = (id: string) => {
    deleteRequest(id);
  };

  const updateRequestStatus = (id: string, status: GroceryRequest["status"]) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <RequestsContext.Provider value={{ requests, addRequest, deleteRequest, cancelRequest, updateRequestStatus }}>
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error("useRequests must be used within RequestsProvider");
  }
  return context;
};
