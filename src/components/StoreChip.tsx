import { Store } from "@/types";

interface StoreChipProps {
  store: Store;
}

const StoreChip = ({ store }: StoreChipProps) => {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-2xl shadow-sm transition-transform hover:scale-105">
        {store.icon}
      </div>
      <span className="text-xs font-medium text-foreground truncate max-w-[80px]">
        {store.name}
      </span>
      <span className="text-[10px] text-muted-foreground">{store.distance}</span>
    </div>
  );
};

export default StoreChip;
