import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockProducts } from "@/data/mockData";
import { mockStores } from "@/data/mockData";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

const SelectProduct = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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

  const handleSelect = (product: Product) => {
    navigate("/post", { state: { selectedProduct: product } });
  };

  const getStoreNames = (storeIds: string[]) => {
    return storeIds
      .map((id) => mockStores.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-foreground p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-display font-bold">Select a Product</h1>
        </div>
      </header>

      <div className="mx-auto max-w-md p-4 space-y-4 animate-fade-in">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, brands, or categories..."
            className="pl-10 bg-card rounded-xl"
          />
        </div>

        {/* Results */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelect(product)}
                className={cn(
                  "glass-card rounded-2xl p-3 text-left transition-all",
                  "hover:ring-2 hover:ring-primary/50 hover:scale-[1.02]",
                  "focus:outline-none focus:ring-2 focus:ring-primary"
                )}
              >
                <div className="aspect-square rounded-xl bg-muted mb-3 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-muted-foreground">
                      🛒
                    </div>
                  )}
                </div>
                <h3 className="font-display font-bold text-sm text-foreground line-clamp-2">
                  {product.brand ? `${product.name} (${product.brand})` : product.name}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {getStoreNames(product.storeIds)}
                </p>
                {product.price != null && (
                  <p className="text-xs font-bold text-primary mt-1">¥{product.price}</p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-center text-muted-foreground">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm font-medium">No products found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}

        {/* Or enter manually */}
        <div className="pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate("/post")}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Or enter product name manually
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectProduct;
