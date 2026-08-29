import { useState, useEffect } from "react";
import { ImageIcon, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAssets, uploadAsset, deleteAsset as delAsset, type Asset } from "@/lib/assetService";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";

interface AssetImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  folder?: string;
}

export default function AssetImagePicker({ value, onChange, onClear, folder = "general" }: AssetImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [directUpload, setDirectUpload] = useState(false);
  const { toast } = useToast();

  const fetchAssets = async () => {
    setLoading(true);
    try { const data = await getAssets(); setAssets(data); } catch { /* */ }
    finally { setLoading(false); }
  };

  useEffect(() => { if (open) fetchAssets(); }, [open]);

  const handleDirectUpload = async (file: File) => {
    setUploading(true);
    try {
      const asset = await uploadAsset(file, folder);
      setAssets((prev) => [asset, ...prev]);
      onChange(asset.url);
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); setDirectUpload(false); }
  };

  const handleSelect = (url: string) => { onChange(url); setOpen(false); };

  const handleRemove = async () => {
    const asset = assets.find((a) => a.url === value);
    if (asset) { try { await delAsset(asset.id!); } catch { /* */ } }
    onChange("");
    onClear?.();
  };

  return (
    <div>
      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/40 transition cursor-pointer" onClick={() => setOpen(true)}>
        {value ? (
          <div className="relative">
            <img src={value} alt="Selected" className="w-full h-48 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
              <Button size="icon" variant="destructive" onClick={(e) => { e.stopPropagation(); handleRemove(); }}><Trash2 className="h-4 w-4" /></Button>
              <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); setOpen(true); }}><ImageIcon className="h-4 w-4" /></Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
            <span className="text-sm text-muted-foreground">Click to pick or upload an image</span>
            <span className="text-xs text-muted-foreground/70">{assets.length} asset(s) available</span>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Asset Image Picker</DialogTitle></DialogHeader>

          <div className="mb-4">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setDirectUpload(true)} disabled={uploading}>
              <ImageIcon className="mr-2 h-4 w-4" /> {uploading ? "Uploading..." : "Upload New Image"}
            </Button>
            {directUpload && (
              <div className="mt-2">
                <Input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleDirectUpload(file); e.target.value = ""; }} />
                {uploading && <Loader2 className="h-4 w-4 animate-spin mt-2" />}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : assets.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No assets uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {assets.map((asset) => (
                <div key={asset.id} className="relative group cursor-pointer" onClick={() => handleSelect(asset.url)}>
                  <img src={asset.url} alt={asset.originalName} className="w-full aspect-square object-cover rounded-lg border-2 border-transparent group-hover:border-primary transition" style={{ borderColor: value === asset.url ? "var(--primary)" : "transparent" }} />
                  {value === asset.url && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1"><ImageIcon className="h-3 w-3" /></div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition">{asset.originalName}</div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}