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

module.exports = router;