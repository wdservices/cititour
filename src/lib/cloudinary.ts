export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  resourceType?: string;
  bytes?: number;
};

type UploadOptions = {
  folder?: string;
  publicId?: string;
};

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