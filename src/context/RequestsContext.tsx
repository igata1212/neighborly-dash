import { createContext, useContext, ReactNode } from "react";
import { GroceryRequest } from "@/types";
import { useRequests as useSupabaseRequests } from "@/hooks/useRequests";

interface RequestsContextType {
  requests: GroceryRequest[];
  addRequest: (request: Omit<GroceryRequest, "id" | "createdAt" | "createdAtTimestamp" | "weightCategory" | "urgency">) => void;
  deleteRequest: (id: string) => void;
  cancelRequest: (id: string) => void;
  updateRequestStatus: (id: string, status: GroceryRequest["status"]) => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: ReactNode }) => {
  const { requests: dbRequests, addRequest: addDbRequest, updateRequest: updateDbRequest, cancelRequest: cancelDbRequest } = useSupabaseRequests();

  // Convert database requests to app format
  const requests: GroceryRequest[] = dbRequests.map((req: any) => ({
    id: req.id,
    productName: req.product_name,
    storeName: req.store_name,
    reward: req.reward,
    expiryTime: req.deadline ? new Date(req.deadline).toLocaleTimeString() : "By 6:00 PM",
    deliveryPreference: req.delivery_preference as "direct" | "delayed",
    status: req.status as GroceryRequest["status"],
    urgency: req.urgency as "normal" | "rush" | "urgent",
    weightCategory: "basic",
    createdAt: new Date(req.created_at).toLocaleDateString(),
    createdAtTimestamp: new Date(req.created_at).getTime(),
  }));

  const addRequest = async (request: Omit<GroceryRequest, "id" | "createdAt" | "createdAtTimestamp" | "weightCategory" | "urgency">) => {
    try {
      await addDbRequest({
        orderer_id: "default-user-id", // TODO: Use actual user ID from auth
        product_name: request.productName,
        store_name: request.storeName,
        reward: request.reward,
        deadline: new Date().toISOString(),
        delivery_preference: request.deliveryPreference,
        urgency: "normal",
        status: "awaiting",
      });
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await cancelDbRequest(id);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const cancelRequest = async (id: string) => {
    await deleteRequest(id);
  };

  const updateRequestStatus = async (id: string, status: GroceryRequest["status"]) => {
    try {
      await updateDbRequest(id, { status });
    } catch (error) {
      console.error("Error updating request status:", error);
    }
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
