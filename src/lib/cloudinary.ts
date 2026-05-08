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
 * Delete an image from Cloudinary
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY?.trim();
    const apiSecret = import.meta.env.CLOUDINARY_API_SECRET?.trim();
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary configuration missing for delete operation');
      return false;
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateDeleteSignature(publicId, timestamp, apiSecret);
    
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    return data.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

/**
 * Generate signature for delete operations
 */
const generateDeleteSignature = (publicId: string, timestamp: number, apiSecret: string): string => {
  // This is a simplified signature generation
  // In production, use proper crypto library
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}`;
  return btoa(stringToSign); // This is a placeholder - use proper crypto in production
};

/**
 * Get Cloudinary base URL
 */
export const getCloudinaryBaseUrl = (): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
  return cloudName ? `https://res.cloudinary.com/${cloudName}` : '';
};