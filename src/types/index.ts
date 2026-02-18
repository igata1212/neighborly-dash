import { ReactNode } from "react";

export type DeliveryPreference = "direct" | "delayed";

export type RequestStatus = "awaiting" | "shopping" | "delivered";

export type UrgencyLevel = "normal" | "rush" | "urgent";

export interface GroceryRequest {
  id: string;
  productName: string;
  storeName: string;
  reward: number;
  expiryTime: string;
  deliveryPreference: DeliveryPreference;
  status: RequestStatus;
  createdAt: string;
  urgency: UrgencyLevel;
  weightCategory: "basic" | "over3kg" | "over10kg";
}

export interface Store {
  id: string;
  name: string;
  distance: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface DeliveryLocation {
  lat: number;
  lng: number;
  label: string;
}
