import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToCloudinary, validateImageFile, CLOUDINARY_FOLDERS } from '@/lib/cloudinary';

interface MultiImageUploadProps {
  onUploadSuccess: (result: { secureUrl: string; publicId: string }) => void;
  onRemove?: (index: number) => void;
  folder?: string;
  currentImages?: string[];
  accept?: string;
  maxSize?: number;
  className?: string;
  placeholder?: string;
  buttonText?: string;
  disabled?: boolean;
  maxImages?: number;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onUploadSuccess,
  onRemove,
  folder = CLOUDINARY_FOLDERS.LISTINGS,
  currentImages = [],
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  className = '',
  placeholder = 'Click or drag to upload images',
  buttonText = 'Upload Image',
  disabled = false,
  maxImages = 10,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (file: File) => {
    if (disabled || isUploading) return;
    if (currentImages.length >= maxImages) {
      toast({ title: "Max images reached", description: `You can upload up to ${maxImages} images.`, variant: "destructive" });
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({ title: "Invalid File", description: validation.error || "Please select a valid image file.", variant: "destructive" });
      return;
    }
    if (file.size > maxSize) {
      toast({ title: "File Too Large", description: "Please select an image smaller than 10MB.", variant: "destructive" });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const result = await uploadImageToCloudinary(file, { folder });
      setUploadProgress(100);
      onUploadSuccess({ secureUrl: result.secureUrl, publicId: result.publicId });
      toast({ title: "Upload Successful", description: "Image uploaded!" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast({ title: "Upload Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [disabled, isUploading, maxSize, maxImages, currentImages.length, onUploadSuccess, folder, toast]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => handleFileSelect(file));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const files = event.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file) => handleFileSelect(file));
    }
  }, [handleFileSelect]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload dropzone */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer
          transition-all duration-200
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'}
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
          ${disabled ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileInput}
          disabled={disabled || isUploading}
          className="hidden"
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Uploading... {uploadProgress > 0 && `${uploadProgress}%`}</p>
            {uploadProgress > 0 && <Progress value={uploadProgress} className="w-full max-w-[200px]" />}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-2">
            <Plus className="h-6 w-6 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{currentImages.length}/{maxImages} images — {placeholder}</p>
          </div>
        )}
      </div>

      {/* Image preview grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {currentImages.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
              <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded">Cover</span>
              )}
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
