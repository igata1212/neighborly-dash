import { GroceryRequest, Store, ChatMessage, Product } from "@/types";
import oatMilkImage from "@/assets/products/oat-milk.webp";
import breadImage from "@/assets/products/bread.png";
import eggImage from "@/assets/products/egg.jpg";
import almondImage from "@/assets/products/almond.jpg";

export const mockStores: Store[] = [
  { id: "1", name: "Whole Foods", distance: "0.3 mi", icon: "🥬" },
  { id: "2", name: "Trader Joe's", distance: "0.5 mi", icon: "🛒" },
  { id: "3", name: "Safeway", distance: "0.8 mi", icon: "🏪" },
  { id: "4", name: "Target", distance: "1.0 mi", icon: "🎯" },
];

export const mockProducts: Product[] = [
  { id: "p1", name: "Oat Milk", brand: "Oatly", category: "Beverages", price: 398, storeIds: ["1", "3"], imageUrl: oatMilkImage },
  { id: "p2", name: "Sourdough Bread", brand: "Bakery Fresh", category: "Bakery", price: 450, storeIds: ["2", "4"], imageUrl: breadImage },
  { id: "p3", name: "Free-Range Eggs", brand: "Farm Fresh", category: "Dairy & Eggs", price: 680, storeIds: ["1", "2", "3"], imageUrl: eggImage },
  { id: "p4", name: "Organic Almond Milk", brand: "Califia", category: "Beverages", price: 428, storeIds: ["1", "2"], imageUrl: almondImage },
  { id: "p5", name: "Greek Yogurt", brand: "Fage", category: "Dairy & Eggs", price: 298, storeIds: ["1", "3", "4"], imageUrl: "https://placehold.co/120x120/e2e8f0/64748b?text=Yogurt" },
  { id: "p6", name: "Avocado", brand: null, category: "Produce", price: 198, storeIds: ["2", "3"], imageUrl: "https://placehold.co/120x120/e2e8f0/64748b?text=Avocado" },
  { id: "p7", name: "Whole Milk", brand: "Organic Valley", category: "Dairy & Eggs", price: 348, storeIds: ["1", "2", "3", "4"], imageUrl: "https://placehold.co/120x120/e2e8f0/64748b?text=Milk" },
  { id: "p8", name: "Banana (bunch)", brand: null, category: "Produce", price: 148, storeIds: ["1", "2", "4"], imageUrl: "https://placehold.co/120x120/e2e8f0/64748b?text=Banana" },
];

export const mockRequests: GroceryRequest[] = [
  {
    id: "1",
    productName: "Oat Milk (Oatly)",
    storeName: "Whole Foods",
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
    storeName: "Trader Joe's",
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
    storeName: "Safeway",
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
  { id: "1", senderId: "deliver1", senderName: "Taro", text: "On my way to the store now!", timestamp: "5:12 PM", isMe: false },
  { id: "2", senderId: "me", senderName: "You", text: "Thank you! Please grab the one with the blue label", timestamp: "5:13 PM", isMe: true },
  { id: "3", senderId: "deliver1", senderName: "Taro", text: "Got it! Blue label Oatly", timestamp: "5:18 PM", isMe: false },
  { id: "4", senderId: "me", senderName: "You", text: "Perfect, thanks so much!", timestamp: "5:19 PM", isMe: true },
];
