import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Storefront from "./pages/Storefront";
import SelectProduct from "./pages/SelectProduct";
import PostRequest from "./pages/PostRequest";
import MyRequests from "./pages/MyRequests";
import Profile from "./pages/Profile";
import DeliveryMap from "./pages/DeliveryMap";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import BottomTabBar from "./components/BottomTabBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post" element={<Storefront />} />
            <Route path="/post/select" element={<SelectProduct />} />
            <Route path="/post/checkout" element={<PostRequest />} />
            <Route path="/requests" element={<MyRequests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tracking/:id" element={<DeliveryMap />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomTabBar />
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
