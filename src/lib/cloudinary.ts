export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  resourceType?: string;
  bytes?: number;
  format?: string;
  width?: number;
  height?: number;
  createdAt?: string;
};

type UploadOptions = {
  folder?: string;
  publicId?: string;
  tags?: string[];
  transformation?: string;
};

// Default Cloudinary folder structure
export const CLOUDINARY_FOLDERS = {
  EVENTS: 'events',
  BUSINESS: 'businesses',
  USERS: 'users',
  LISTINGS: 'listings',
  TICKETS: 'tickets',
  AVATARS: 'avatars',
  PROPERTIES: 'properties',
  ADS: 'advertisements',
} as const;

export async function uploadImageToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET?.trim();
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY?.trim();
  const signedPreset = import.meta.env.VITE_CLOUDINARY_SIGNED_PRESET?.trim();

  console.log('Cloudinary Config:', {
    cloudName,
    apiKey: apiKey ? '***' + apiKey.slice(-4) : 'missing',
    unsignedPreset,
    folder: options.folder
  });

  if (!cloudName || !apiKey) {
    throw new Error(
      'Cloudinary configuration is missing. Please check your environment variables.'
    );
  }

  if (!unsignedPreset) {
    throw new Error(
      'Cloudinary unsigned upload preset is not configured. Please set VITE_CLOUDINARY_UNSIGNED_PRESET in your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', unsignedPreset);
  
  // Add folder if specified
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  
  // Add public_id if specified
  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }

  try {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    
    console.log('Uploading to Cloudinary:', {
      url: uploadUrl,
      file: file.name,
      size: file.size,
      type: file.type,
      formData: Object.fromEntries(formData.entries())
    });
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    
    console.log('Cloudinary response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || errorData?.message || response.statusText;
      console.error('Cloudinary unsigned upload error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      // If unauthorized/forbidden or signature-related, try signed upload via backend
      const shouldFallbackToSigned =
        response.status === 401 ||
        response.status === 403 ||
        /signature|unsigned|authorize/i.test(String(errorMessage));

      if (shouldFallbackToSigned) {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';
        console.log('Attempting signed upload fallback via server:', serverUrl);

        const signRes = await fetch(`${serverUrl}/api/uploads/sign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            folder: options.folder,
            public_id: options.publicId,
            uploadPreset: signedPreset,
          }),
        });

        if (!signRes.ok) {
          const signText = await signRes.text();
          throw new Error(`Failed to get Cloudinary signature: ${signText}`);
        }

        const {
          signature,
          timestamp,
          apiKey: signedApiKey,
          cloudName: signedCloudName,
          uploadPreset: signedUploadPreset,
        } = await signRes.json();

        const presetToSend = signedUploadPreset || signedPreset;

        const signedFormData = new FormData();
        signedFormData.append('file', file);
        signedFormData.append('api_key', signedApiKey);
        signedFormData.append('signature', signature);
        signedFormData.append('timestamp', String(timestamp));
        if (options.folder) signedFormData.append('folder', options.folder);
        if (options.publicId) signedFormData.append('public_id', options.publicId);
        if (presetToSend) signedFormData.append('upload_preset', presetToSend);

        const signedUploadUrl = `https://api.cloudinary.com/v1_1/${signedCloudName || cloudName}/auto/upload`;
        const signedRes = await fetch(signedUploadUrl, {
          method: 'POST',
          body: signedFormData,
        });

        if (!signedRes.ok) {
          const signedText = await signedRes.text();
          throw new Error(`Cloudinary signed upload failed: ${signedText}`);
        }

        const signedResult = await signedRes.json();
        return {
          secureUrl: signedResult.secure_url,
          publicId: signedResult.public_id,
          resourceType: signedResult.resource_type,
          bytes: signedResult.bytes,
        };
      }

      throw new Error(`Failed to upload image to Cloudinary: ${errorMessage}`);
    }

    const result = await response.json();
    
    if (!result.secure_url) {
      throw new Error('Invalid response from Cloudinary: Missing secure_url');
    }

    return {
      secureUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

/**
 * Get optimized image URL
 */
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: string;
    format?: string;
  } = {}
): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured');
    return '';
  }

  const transformations = [];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.format) transformations.push(`f_${options.format}`);
  
  const transformationString = transformations.length > 0 ? transformations.join(',') : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}${publicId}`;
};

/**
 * Image validation helper
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.',
    };
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File too large. Please upload an image smaller than 10MB.',
    };
  }
  
  return { isValid: true };
};

/**
 * Get image preview URL before upload
 */
export const getImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Extract Cloudinary public_id from a full image URL.
 * URL pattern: https://res.cloudinary.com/{cloud}/image/upload/{version?}/{public_id}.{ext}
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    // Match pattern: /image/upload/ (optional v1234/) then public_id.ext
    const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    if (match && match[1]) {
      // Remove any trailing query params
      return match[1].split('?')[0];
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Delete image(s) from Cloudinary via server endpoint.
 * Best-effort: returns results even if some deletes fail.
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  return deleteImagesFromCloudinary([publicId]);
};

/**
 * Delete multiple images from Cloudinary via server endpoint.
 */
export const deleteImagesFromCloudinary = async (publicIds: string[]): Promise<boolean> => {
  if (!publicIds.length) return true;
  try {
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';
    const resp = await fetch(`${serverUrl}/api/uploads/destroy`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_ids: publicIds }),
    });
    const data = await resp.json();
    return data?.status === true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

/**
 * Collect all public_ids from a listing document for deletion.
 * Checks imagePublicIds (array), imagePublicId (singular), and extracts from URL.
 */
export const collectPublicIdsForListing = (data: any): string[] => {
  const ids: string[] = [];
  if (data.imagePublicIds && Array.isArray(data.imagePublicIds)) {
    ids.push(...data.imagePublicIds.filter(Boolean));
  }
  if (data.imagePublicId) {
    ids.push(data.imagePublicId);
  }
  // Extract from image URL if no stored public_ids
  if (ids.length === 0 && data.image) {
    const extracted = extractPublicIdFromUrl(data.image);
    if (extracted) ids.push(extracted);
  }
  // Also check images array
  if (data.images && Array.isArray(data.images)) {
    for (const url of data.images) {
      const extracted = extractPublicIdFromUrl(url);
      if (extracted && !ids.includes(extracted)) ids.push(extracted);
    }
  }
  return ids;
};

/**
 * Get Cloudinary base URL
 */
export const getCloudinaryBaseUrl = (): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  return cloudName ? `https://res.cloudinary.com/${cloudName}` : '';
};