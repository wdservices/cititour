const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_SIGNED_PRESET,
} = process.env;

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Health check
router.get('/', (req, res) => {
  res.json({ status: true, message: 'Uploads route operational' });
});

// Generate a signature for signed uploads
router.post('/sign', (req, res) => {
  try {
    const hasCloudName = !!CLOUDINARY_CLOUD_NAME && CLOUDINARY_CLOUD_NAME.trim().length > 0;
    const hasApiKey = !!CLOUDINARY_API_KEY && CLOUDINARY_API_KEY.trim().length > 0;
    const hasApiSecret = !!CLOUDINARY_API_SECRET && CLOUDINARY_API_SECRET.trim().length > 0;

    if (!hasCloudName || !hasApiKey || !hasApiSecret) {
      return res.status(500).json({ error: 'Cloudinary environment not configured', details: { hasCloudName, hasApiKey, hasApiSecret } });
    }

    const { folder, public_id, uploadPreset } = req.body || {};
    const timestamp = Math.floor(Date.now() / 1000);
    const presetToUse = uploadPreset || CLOUDINARY_SIGNED_PRESET;

    const paramsToSign = { timestamp };
    if (folder) paramsToSign.folder = folder;
    if (public_id) paramsToSign.public_id = public_id;
    if (presetToUse) paramsToSign.upload_preset = presetToUse;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: presetToUse,
    });
  } catch (err) {
    console.error('Cloudinary signing error:', err);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
});

// Delete image(s) from Cloudinary
router.delete('/destroy', async (req, res) => {
  try {
    if (!CLOUDINARY_API_SECRET) {
      return res.status(500).json({ status: false, message: 'Cloudinary not configured' });
    }

    const { public_id, public_ids } = req.body;
    const ids = public_ids || (public_id ? [public_id] : []);

    if (ids.length === 0) {
      return res.status(400).json({ status: false, message: 'public_id or public_ids array is required' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const result = await cloudinary.uploader.destroy(id);
        results.push({ public_id: id, result: result.result });
      } catch (err) {
        console.error(`Cloudinary destroy error for ${id}:`, err.message);
        results.push({ public_id: id, result: 'error', error: err.message });
      }
    }

    return res.json({ status: true, results });
  } catch (error) {
    console.error('Cloudinary bulk destroy error:', error);
    return res.status(500).json({ status: false, message: 'Error deleting images' });
  }
});

module.exports = router;