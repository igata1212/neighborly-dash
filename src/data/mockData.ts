import { GroceryRequest, Store } from "@/types";

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
    reward: 3.0,
    expiryTime: "6:00 PM",
    deliveryPreference: "delayed",
    status: "awaiting",
    createdAt: "2 min ago",
  },
  {
    id: "2",
    productName: "Sourdough Bread",
    storeName: "Green Grocers",
    reward: 2.5,
    expiryTime: "5:30 PM",
    deliveryPreference: "direct",
    status: "shopping",
    createdAt: "15 min ago",
  },
  {
    id: "3",
    productName: "Free-Range Eggs (dozen)",
    storeName: "Daily Essentials",
    reward: 4.0,
    expiryTime: "7:00 PM",
    deliveryPreference: "delayed",
    status: "delivered",
    createdAt: "1 hr ago",
  },
];
