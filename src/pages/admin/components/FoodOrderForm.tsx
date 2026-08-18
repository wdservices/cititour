import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Minus, Plus, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import {
  type FoodItem, type FoodCategory, type FoodOrderItem,
  getFoodItems, getFoodCategories,
} from "@/lib/foodMenu";
import { generateOrderNumber, addFoodOrder } from "@/lib/foodOrders";

interface Props {
  rooms?: any[];
  bookings?: any[];
  onSubmit: (order: any) => void;
  onCancel: () => void;
}

export default function FoodOrderForm({ rooms = [], bookings = [], onSubmit, onCancel }: Props) {
  const [unitId, setUnitId] = useState("");
  const [items, setItems] = useState<FoodOrderItem[]>([]);
  const [instructions, setInstructions] = useState("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [fi, cat] = await Promise.all([getFoodItems(), getFoodCategories()]);
        setFoodItems(fi.filter((i) => i.available));
        setCategories(cat.filter((c) => c.active));
      } catch { toast.error("Failed to load menu"); }
      finally { setLoading(false); }
    })();
  }, []);

  const filteredItems = foodItems
    .filter((i) => selectedCat === "all" || i.categoryId === selectedCat)
    .filter((i) => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const addItem = (item: FoodItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.foodItemId === item.id);
      if (existing) {
        return prev.map((i) => i.foodItemId === item.id ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price } : i);
      }
      return [...prev, {
        foodItemId: item.id!, name: item.name, price: item.price,
        complimentary: item.complimentary || false, quantity: 1,
        subtotal: item.complimentary ? 0 : item.price,
      }];
    });
  };

  const updateQty = (foodItemId: string, delta: number) => {
    setItems((prev) => {
      const updated = prev.map((i) => {
        if (i.foodItemId !== foodItemId) return i;
        const newQty = i.quantity + delta;
        if (newQty <= 0) return null;
        return { ...i, quantity: newQty, subtotal: i.complimentary ? 0 : newQty * i.price };
      }).filter(Boolean) as FoodOrderItem[];
      return updated;
    });
  };

  const removeItem = (foodItemId: string) => {
    setItems((prev) => prev.filter((i) => i.foodItemId !== foodItemId));
  };

  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  const selectedUnit = rooms.find((u: any) => (u.id || u.roomId) === unitId);

  const handleSubmit = async () => {
    if (!unitId) return toast.error("Select a guest unit");
    if (items.length === 0) return toast.error("Add at least one item");
    setSubmitting(true);
    try {
      const orderNumber = await generateOrderNumber();
      const unit = rooms.find((u: any) => (u.id || u.roomId) === unitId);
      const order = await addFoodOrder({
        orderNumber,
        unitName: unit?.name || "",
        unitId,
        items,
        totalAmount: total,
        specialInstructions: instructions,
        status: "pending",
        createdBy: "Front Desk",
      });
      onSubmit({ id: order, orderNumber, unitName: unit?.name, items, totalAmount: total, specialInstructions: instructions, status: "pending" });
      toast.success(`Order ${orderNumber} placed`);
    } catch (e: any) {
      toast.error(e.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step 1: Guest Unit */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
          <span className="text-sm font-semibold text-blue-900">Guest Unit</span>
        </div>
        <Select value={unitId} onValueChange={setUnitId}>
          <SelectTrigger className="h-11 bg-white"><SelectValue placeholder="Select room" /></SelectTrigger>
          <SelectContent>
            {rooms.map((room: any) => {
              const rid = room.id || room.roomId;
              return (
                <SelectItem key={rid} value={rid}>
                  {room.name || rid}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {selectedUnit && (
          <div className="mt-3 space-y-1">
            <p className="text-xs text-blue-600/70">
              {selectedUnit.capacity ? `${selectedUnit.capacity} guests` : ""}
              {selectedUnit.beds ? ` · ${selectedUnit.beds} bed${selectedUnit.beds > 1 ? "s" : ""}` : ""}
            </p>
            {(() => {
              const occupant = bookings.find((b: any) => {
                const bookingRoomName = b.roomName?.toLowerCase();
                const roomName = selectedUnit.name?.toLowerCase();
                const roomId = selectedUnit.id || selectedUnit.roomId;
                return (bookingRoomName === roomName || b.roomId === roomId) && b.status !== "cancelled";
              });
              if (occupant) {
                const guestName = [occupant.guestFirstName, occupant.guestLastName].filter(Boolean).join(" ") || occupant.guest_name || "Guest";
                return (
                  <div className="flex items-center gap-2 bg-blue-100 rounded-lg px-3 py-2 mt-2">
                    <div className="h-7 w-7 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                      {guestName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">{guestName}</p>
                      {occupant.guestPhone && <p className="text-xs text-blue-600/70">{occupant.guestPhone}</p>}
                    </div>
                  </div>
                );
              }
              return <p className="text-xs text-blue-500 italic">No active booking for this room</p>;
            })()}
          </div>
        )}
      </div>

      {/* Step 2: Add Items */}
      <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-6 w-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">2</span>
          <span className="text-sm font-semibold text-amber-900">Add Food Items</span>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 bg-white border border-amber-200" placeholder="Search menu..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
          <button onClick={() => setSelectedCat("all")} className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border transition ${selectedCat === "all" ? "bg-amber-600 text-white border-amber-600" : "bg-white border-amber-200"}`}>
            All
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setSelectedCat(c.id!)} className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border transition ${selectedCat === c.id ? "bg-amber-600 text-white border-amber-600" : "bg-white border-amber-200"}`}>
              {c.icon ? `${c.icon} ` : ""}{c.name}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-white/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
            {filteredItems.map((item) => (
              <button key={item.id} onClick={() => addItem(item)} className="text-left p-3 rounded-lg border border-amber-200 bg-white hover:border-amber-500 hover:bg-amber-100/50 transition text-sm">
                <span className="font-medium line-clamp-1 block">{item.name}</span>
                <span className="text-amber-700 text-xs font-semibold">
                  {item.complimentary ? "Complimentary" : `₦${item.price.toLocaleString()}`}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 3: Order Summary */}
      {items.length > 0 && (
        <div className="rounded-xl bg-green-50 border border-green-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <span className="text-sm font-semibold text-green-900">Order Summary</span>
            </div>
            <span className="text-sm font-normal text-green-600">{items.length} item{items.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="bg-white rounded-lg divide-y divide-green-100">
            {items.map((item) => (
              <div key={item.foodItemId} className="flex items-center justify-between p-3">
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm truncate block">{item.name}</span>
                  <span className="text-xs text-green-700">{item.complimentary ? "Comp." : `₦${item.price.toLocaleString()}`}</span>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <Button variant="outline" size="icon" className="h-7 w-7 border-green-300 hover:bg-green-100" onClick={() => updateQty(item.foodItemId, -1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7 border-green-300 hover:bg-green-100" onClick={() => updateQty(item.foodItemId, 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => removeItem(item.foodItemId)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-green-200">
            <span className="font-semibold text-green-800">Total</span>
            <span className="text-xl font-bold text-green-700">₦{total.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Step 4: Special Instructions */}
      <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-6 w-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">4</span>
          <span className="text-sm font-semibold text-purple-900">Special Instructions</span>
        </div>
        <Textarea
          className="bg-white border-purple-200 focus-visible:ring-purple-400"
          placeholder="e.g., No onions, extra spicy, allergy notes..."
          value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled={!unitId || items.length === 0 || submitting} onClick={handleSubmit}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingBag className="mr-2 h-4 w-4" />}
          Place Order — ₦{total.toLocaleString()}
        </Button>
      </div>
    </div>
  );
}
