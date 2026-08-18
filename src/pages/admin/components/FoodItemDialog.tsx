import { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  type FoodItem, type FoodCategory, addFoodItem, updateFoodItem,
  slugify, isSlugTaken, uploadToCloudinary,
} from "@/lib/foodMenu";

interface Props {
  onSaved: () => void;
  item?: FoodItem;
  categories: FoodCategory[];
  trigger?: React.ReactNode;
}

const SPICE_LEVELS = ["none", "mild", "medium", "hot", "extra-hot"] as const;

export default function FoodItemDialog({ onSaved, item, categories, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: 0, discountPrice: null as number | null,
    image: "", categoryId: "", ingredients: "", preparationTime: 0, calories: 0,
    spiceLevel: "none" as FoodItem["spiceLevel"],
    vegetarian: false, vegan: false, containsNuts: false, containsDairy: false,
    containsSeafood: false, featured: false, available: true, displayOrder: "0",
  });

  useEffect(() => {
    if (item && open) {
      setForm({
        name: item.name, slug: item.slug, description: item.description,
        price: item.price, discountPrice: item.discountPrice ?? null,
        image: item.image, categoryId: item.categoryId,
        ingredients: item.ingredients || "", preparationTime: item.preparationTime || 0,
        calories: item.calories || 0, spiceLevel: item.spiceLevel || "none",
        vegetarian: item.vegetarian || false, vegan: item.vegan || false,
        containsNuts: item.containsNuts || false, containsDairy: item.containsDairy || false,
        containsSeafood: item.containsSeafood || false, featured: item.featured || false,
        available: item.available, displayOrder: String(item.displayOrder || 0),
      });
    } else if (open) {
      setForm({
        name: "", slug: "", description: "", price: 0, discountPrice: null,
        image: "", categoryId: "", ingredients: "", preparationTime: 0, calories: 0,
        spiceLevel: "none", vegetarian: false, vegan: false, containsNuts: false,
        containsDairy: false, containsSeafood: false, featured: false, available: true,
        displayOrder: "0",
      });
    }
  }, [item, open]);

  const setName = (v: string) => {
    setForm((p) => ({
      ...p, name: v,
      slug: item ? p.slug : slugify(v),
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      setForm((p) => ({ ...p, image: result.secureUrl }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!form.categoryId) return toast.error("Category is required");
    if (form.price <= 0 && !form.featured) return toast.error("Price must be greater than 0");
    if (!form.image) return toast.error("Image is required");
    if (!form.slug) {
      form.slug = slugify(form.name);
    }
    const taken = await isSlugTaken(form.slug, item?.id);
    if (taken) return toast.error("Slug is already taken");

    setLoading(true);
    try {
      const cat = categories.find((c) => c.id === form.categoryId);
      const data: Omit<FoodItem, "id" | "createdAt" | "updatedAt"> = {
        name: form.name.trim(),
        slug: form.slug,
        description: form.description.trim(),
        price: form.price,
        discountPrice: form.discountPrice,
        image: form.image,
        categoryId: form.categoryId,
        categoryName: cat?.name || "",
        ingredients: form.ingredients,
        preparationTime: form.preparationTime,
        calories: form.calories,
        spiceLevel: form.spiceLevel,
        vegetarian: form.vegetarian,
        vegan: form.vegan,
        containsNuts: form.containsNuts,
        containsDairy: form.containsDairy,
        containsSeafood: form.containsSeafood,
        featured: form.featured,
        complimentary: form.price === 0,
        available: form.available,
        displayOrder: parseInt(form.displayOrder) || 0,
      };
      if (item?.id) {
        await updateFoodItem(item.id, data);
        toast.success("Item updated");
      } else {
        await addFoodItem(data);
        toast.success("Item created");
      }
      onSaved();
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">{trigger}</div>
      ) : (
        <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-primary to-primary/80">
          Add Food Item
        </Button>
      )}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Food Item" : "Add New Food Item"}</DialogTitle>
        </DialogHeader>

        {/* Image Upload */}
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
            uploading ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/40"
          }`}
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files[0];
            if (file) handleImageUpload(file);
          }}
        >
          <input
            ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageUpload(f);
              e.target.value = "";
            }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Processing...</span>
            </div>
          ) : form.image ? (
            <div className="relative inline-block">
              <img src={form.image} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
              <Button
                size="icon" variant="destructive"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={(e) => { e.stopPropagation(); setForm((p) => ({ ...p, image: "" })); }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground/40" />
              <span className="text-sm text-muted-foreground">Click or drag & drop to upload</span>
              <span className="text-xs text-muted-foreground/70">JPG, PNG, WebP · max 8MB</span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-2">
            <Label>Food Name *</Label>
            <Input value={form.name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jollof Rice & Chicken" />
          </div>
          <div className="md:col-span-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="auto-generated" />
          </div>
          <div className="md:col-span-2">
            <Label>Description *</Label>
            <Textarea
              value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Rich Nigerian jollof served with grilled chicken..." rows={2}
            />
          </div>
          <div>
            <Label>Category *</Label>
            <Select value={form.categoryId} onValueChange={(v) => setForm((p) => ({ ...p, categoryId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="none" disabled>No categories yet</SelectItem>
                ) : categories.map((c) => (
                  <SelectItem key={c.id} value={c.id!}>
                    {c.icon ? `${c.icon} ` : ""}{c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Price (NGN) *</Label>
            <Input type="number" min="0" value={form.price || ""} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} placeholder="e.g. 8500" />
          </div>
          <div>
            <Label>Discount Price</Label>
            <Input type="number" min="0" value={form.discountPrice ?? ""} onChange={(e) => setForm((p) => ({ ...p, discountPrice: e.target.value ? Number(e.target.value) : null }))} placeholder="e.g. 6500" />
          </div>
          <div>
            <Label>Display Order</Label>
            <Input type="number" min="0" value={form.displayOrder} onChange={(e) => setForm((p) => ({ ...p, displayOrder: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <Label>Ingredients</Label>
            <Textarea
              value={form.ingredients} onChange={(e) => setForm((p) => ({ ...p, ingredients: e.target.value }))}
              placeholder="Rice, tomato, chicken, pepper..." rows={2}
            />
          </div>
          <div>
            <Label>Prep Time (min)</Label>
            <Input type="number" min="0" value={form.preparationTime || ""} onChange={(e) => setForm((p) => ({ ...p, preparationTime: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Calories</Label>
            <Input type="number" min="0" value={form.calories || ""} onChange={(e) => setForm((p) => ({ ...p, calories: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Spice Level</Label>
            <Select value={form.spiceLevel} onValueChange={(v: any) => setForm((p) => ({ ...p, spiceLevel: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SPICE_LEVELS.map((s) => (
                  <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dietary Info */}
        <div className="rounded-lg border p-4 mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: "vegetarian", label: "Vegetarian" },
            { key: "vegan", label: "Vegan" },
            { key: "containsNuts", label: "Contains Nuts" },
            { key: "containsDairy", label: "Contains Dairy" },
            { key: "containsSeafood", label: "Contains Seafood" },
          ].map((d) => (
            <label key={d.key} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={(form as any)[d.key]}
                onCheckedChange={(c) => setForm((p) => ({ ...p, [d.key]: !!c }))}
              />
              <span className="text-sm">{d.label}</span>
            </label>
          ))}
        </div>

        {/* Bottom Checkboxes */}
        <div className="flex gap-6 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={form.available} onCheckedChange={(c) => setForm((p) => ({ ...p, available: !!c }))} />
            <span className="text-sm font-medium">Available</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={form.featured} onCheckedChange={(c) => setForm((p) => ({ ...p, featured: !!c }))} />
            <span className="text-sm font-medium">Chef&apos;s Special</span>
          </label>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {item ? "Update Item" : "Create Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
