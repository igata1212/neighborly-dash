import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { mockProducts, mockStores } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

const Storefront = () => {
  const navigate = useNavigate();
  const { items, addToCart, removeFromCart, updateQuantity, itemCount } = useCart();
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return mockProducts;
    const q = search.toLowerCase().trim();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    );
  }, [search]);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/post/checkout");
  };

  const getStoreNames = (storeIds: string[]) =>
    storeIds
      .map((id) => mockStores.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(", ");

  const cartTotal = items.reduce(
    (sum, i) => sum + (i.product.price ?? 0) * i.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header - Amazon-style */}
      <header className="sticky top-0 z-40 border-b border-border bg-primary text-primary-foreground px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-primary-foreground/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 text-lg font-display font-bold">NeighborMart</h1>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="pl-10 bg-background text-foreground border-0 rounded-lg"
            />
          </div>
        </div>
      </header>

      {/* Product grid */}
      <div className="mx-auto max-w-md p-4 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
              getStoreNames={getStoreNames}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center text-muted-foreground">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm font-medium">No products found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm font-medium">Your cart is empty</p>
                <p className="text-xs mt-1">Add some products to get started</p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-border p-3 bg-card"
                >
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        🛒
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-sm line-clamp-2">
                      {product.brand ? `${product.name} (${product.brand})` : product.name}
                    </h3>
                    {product.price != null && (
                      <p className="text-xs font-bold text-primary mt-0.5">¥{product.price}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1.5 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-2 text-sm font-medium min-w-[24px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1.5 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <SheetFooter className="flex-col gap-2 sm:flex-col">
            {items.length > 0 && (
              <div className="w-full flex justify-between text-sm font-bold py-2">
                <span>Subtotal</span>
                <span className="text-primary">¥{cartTotal}</span>
              </div>
            )}
            <Button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full rounded-xl font-display font-bold"
            >
              Proceed to Checkout
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

function ProductCard({
  product,
  onAddToCart,
  getStoreNames,
}: {
  product: Product;
  onAddToCart: () => void;
  getStoreNames: (ids: string[]) => string;
}) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      <div className="aspect-square bg-muted relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
            🛒
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-display font-bold text-sm text-foreground line-clamp-2">
          {product.brand ? `${product.name} (${product.brand})` : product.name}
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
          {getStoreNames(product.storeIds)}
        </p>
        <div className="flex items-center justify-between mt-2">
          {product.price != null && (
            <span className="text-sm font-bold text-primary">¥{product.price}</span>
          )}
          <button
            type="button"
            onClick={onAddToCart}
            className={cn(
              "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold",
              "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default Storefront;
