import { GroceryRequest, Store, ChatMessage } from "@/types";

export const mockStores: Store[] = [
  { id: "1", name: "Fresh Mart", distance: "0.3 mi", icon: "🏪" },
  { id: "2", name: "Green Grocers", distance: "0.5 mi", icon: "🥬" },
  { id: "3", name: "Daily Essentials", distance: "0.8 mi", icon: "🛒" },
  { id: "4", name: "Corner Deli", distance: "1.0 mi", icon: "🧀" },
];

export const mockRequests: GroceryRequest[] = [
  {
    id: "1",
    productName: "Oat Milk (Oatly)",
    storeName: "Fresh Mart",
    reward: 250,
    expiryTime: "6:00 PM",
    deliveryPreference: "delayed",
    status: "awaiting",
    createdAt: "2 min ago",
    urgency: "normal",
    weightCategory: "basic",
  },
  {
    id: "2",
    productName: "Sourdough Bread",
    storeName: "Green Grocers",
    reward: 450,
    expiryTime: "5:30 PM",
    deliveryPreference: "direct",
    status: "shopping",
    createdAt: "15 min ago",
    urgency: "rush",
    weightCategory: "over3kg",
  },
  {
    id: "3",
    productName: "Free-Range Eggs (dozen)",
    storeName: "Daily Essentials",
    reward: 750,
    expiryTime: "7:00 PM",
    deliveryPreference: "delayed",
    status: "delivered",
    createdAt: "1 hr ago",
    urgency: "urgent",
    weightCategory: "over10kg",
  },
];

export const mockChatMessages: ChatMessage[] = [
  { id: "1", senderId: "deliver1", senderName: "Taro", text: "On my way to the store now! 🏃", timestamp: "5:12 PM", isMe: false },
  { id: "2", senderId: "me", senderName: "You", text: "Thank you! Please grab the one with the blue label", timestamp: "5:13 PM", isMe: true },
  { id: "3", senderId: "deliver1", senderName: "Taro", text: "Got it! Blue label Oatly 👍", timestamp: "5:18 PM", isMe: false },
  { id: "4", senderId: "me", senderName: "You", text: "Perfect, thanks so much!", timestamp: "5:19 PM", isMe: true },
];
