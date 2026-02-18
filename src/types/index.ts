import { ReactNode } from "react";

export type DeliveryPreference = "direct" | "delayed";

export type RequestStatus = "awaiting" | "shopping" | "delivered";

export interface GroceryRequest {
  id: string;
  productName: string;
  storeName: string;
  reward: number;
  expiryTime: string;
  deliveryPreference: DeliveryPreference;
  status: RequestStatus;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  distance: string;
  icon: string;
}
