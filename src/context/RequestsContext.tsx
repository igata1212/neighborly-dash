import { createContext, useContext, ReactNode } from "react";
import { GroceryRequest } from "@/types";
import { useRequests as useSupabaseRequests } from "@/hooks/useRequests";
import { supabase } from "@/integrations/supabase/client";

interface RequestsContextType {
  requests: GroceryRequest[];
  addRequest: (request: Omit<GroceryRequest, "id" | "createdAt" | "weightCategory" | "urgency" | "status">) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  cancelRequest: (id: string) => Promise<void>;
  updateRequestStatus: (id: string, status: GroceryRequest["status"]) => Promise<void>;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

const DEMO_ORDERER_STORAGE_KEY = "neighborly.orderer_id";

const normalizeStatus = (status: string): GroceryRequest["status"] => {
  if (status === "delivered") return "delivered";
  if (status === "shopping" || status === "scanned" || status === "dropoff" || status === "accepted") {
    return "shopping";
  }
  return "awaiting";
};

const toDeadlineISOString = (deliveryTime: string) => {
  const [hours, minutes] = deliveryTime.split(":").map(Number);
  const deadline = new Date();

  deadline.setHours(hours, minutes, 0, 0);

  if (deadline.getTime() <= Date.now()) {
    deadline.setDate(deadline.getDate() + 1);
  }

  return deadline.toISOString();
};

const getOrCreateDemoOrdererId = async () => {
  const cachedId = localStorage.getItem(DEMO_ORDERER_STORAGE_KEY);

  if (cachedId) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", cachedId)
      .single();

    if (existing?.id) {
      return existing.id;
    }
  }

  const { data: existingByName } = await supabase
    .from("users")
    .select("id")
    .eq("name", "Dash Demo User")
    .eq("user_type", "orderer")
    .limit(1)
    .maybeSingle();

  if (existingByName?.id) {
    localStorage.setItem(DEMO_ORDERER_STORAGE_KEY, existingByName.id);
    return existingByName.id;
  }

  const { data: created, error } = await supabase
    .from("users")
    .insert({
      name: "Dash Demo User",
      user_type: "orderer",
      location: "Local",
    })
    .select("id")
    .single();

  if (error) throw error;

  localStorage.setItem(DEMO_ORDERER_STORAGE_KEY, created.id);
  return created.id;
};

export const RequestsProvider = ({ children }: { children: ReactNode }) => {
  const {
    requests: dbRequests,
    addRequest: addDbRequest,
    updateRequest: updateDbRequest,
    cancelRequest: cancelDbRequest,
  } = useSupabaseRequests();

  const requests: GroceryRequest[] = dbRequests.map((request) => ({
    id: request.id,
    productName: request.product_name,
    storeName: request.store_name,
    reward: request.reward,
    expiryTime: request.deadline
      ? new Date(request.deadline).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : "6:00 PM",
    deliveryPreference: request.delivery_preference === "delayed" ? "delayed" : "direct",
    status: normalizeStatus(request.status),
    urgency: request.urgency === "rush" || request.urgency === "urgent" ? request.urgency : "normal",
    weightCategory: "basic",
    createdAt: new Date(request.created_at).toLocaleDateString(),
  }));

  const addRequest = async (
    request: Omit<GroceryRequest, "id" | "createdAt" | "weightCategory" | "urgency" | "status">
  ) => {
    const ordererId = await getOrCreateDemoOrdererId();

    await addDbRequest({
      orderer_id: ordererId,
      product_name: request.productName,
      store_name: request.storeName,
      reward: request.reward,
      deadline: toDeadlineISOString(request.expiryTime),
      delivery_preference: request.deliveryPreference,
      urgency: "normal",
      status: "awaiting",
    });
  };

  const deleteRequest = async (id: string) => {
    await cancelDbRequest(id);
  };

  const cancelRequest = async (id: string) => {
    await deleteRequest(id);
  };

  const updateRequestStatus = async (id: string, status: GroceryRequest["status"]) => {
    await updateDbRequest(id, { status });
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
