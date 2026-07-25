const CLOUDINARY_CLOUD_NAME = 'diq3wnetq';
const CLOUDINARY_UNSIGNED_PRESET = 'cititour_preset';

export async function uploadImageToCloudinary(uri: string, folder: string): Promise<{ secureUrl: string; publicId: string }> {
  const formData = new FormData();
  const filename = uri.split('/').pop() || 'photo.jpg';
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  formData.append('file', { uri, name: filename, type: mimeType } as any);
  formData.append('upload_preset', CLOUDINARY_UNSIGNED_PRESET);
  formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Upload failed');
  }

  const data = await res.json();
  return { secureUrl: data.secure_url, publicId: data.public_id };
}

export const CLOUDINARY_FOLDERS = {
  BUSINESSES: 'cititour/businesses',
  MARKETPLACE: 'cititour/marketplace',
  PROPERTIES: 'cititour/properties',
  EVENTS: 'cititour/events',
  LISTINGS: 'cititour/listings',
};
