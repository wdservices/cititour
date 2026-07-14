import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToCloudinary, validateImageFile, getImagePreview, CLOUDINARY_FOLDERS } from '@/lib/cloudinary';

interface ImageUploadProps {
  onUploadSuccess: (result: { secureUrl: string; publicId: string }) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  currentImage?: string;
  accept?: string;
  maxSize?: number;
  className?: string;
  showPreview?: boolean;
  placeholder?: string;
  buttonText?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  folder = CLOUDINARY_FOLDERS.LISTINGS,
  currentImage,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  showPreview = true,
  placeholder = 'Click to upload image',
  buttonText = 'Upload Image',
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (file: File) => {
    if (disabled || isUploading) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid File",
        description: validation.error || "Please select a valid image file.",
        variant: "destructive",
      });
      onUploadError?.(validation.error || "Invalid file");
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      onUploadError?.("File too large");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Show preview
      if (showPreview) {
        const previewUrl = await getImagePreview(file);
        setPreview(previewUrl);
      }

      // Upload to Cloudinary
      const result = await uploadImageToCloudinary(file, { folder });
      
      setUploadProgress(100);
      
      // Success callback
      onUploadSuccess({
        secureUrl: result.secureUrl,
        publicId: result.publicId,
      });

      toast({
        title: "Upload Successful",
        description: "Image uploaded successfully!",
      });

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });

      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [disabled, isUploading, maxSize, onUploadSuccess, onUploadError, showPreview, toast]);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeImage = useCallback(() => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      <Button
        type="button"
        onClick={triggerFileInput}
        disabled={disabled || isUploading}
        className="w-full h-12 bg-primary hover:opacity-90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          disabled={disabled || isUploading}
          className="hidden"
        />
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2 group-hover:translate-y-[-2px] transition-transform" />
            {buttonText}
          </>
        )}
      </Button>

      {/* Upload Area (for drag & drop) */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'}
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
          ${disabled ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
            {uploadProgress > 0 && (
              <Progress value={uploadProgress} className="w-full max-w-xs" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              Or drag and drop files here
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      {(showPreview && (preview || currentImage)) && (
        <div className="relative">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={preview || currentImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Remove Button */}
          {preview && !isUploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeImage}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Alternative Upload Button */}
      {!showPreview && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={triggerFileInput}
          disabled={disabled || isUploading}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
