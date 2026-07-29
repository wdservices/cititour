const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const app = express();

// Security headers
app.use(helmet());

// CORS — allowlist production + local dev
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:8081',
  'https://citivas.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global rate limiter — 100 requests per 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: false, message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// Strict rate limiter for payment endpoints — 10 requests per 15 min per IP
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: false, message: 'Too many payment attempts, please try again later.' },
});

// Raw body for Paystack webhook signature verification (must be BEFORE express.json)
app.use('/api/wallet/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: true, message: 'Wallet server running' });
});

// Require routes after dotenv has loaded env variables
const walletRoutes = require('./walletRoutes.cjs');
const uploadRoutes = require('./uploadRoutes.cjs');
app.use('/api/wallet', paymentLimiter, walletRoutes);
app.use('/api/uploads', paymentLimiter, uploadRoutes);

// Serve favicon to avoid 404s from browsers requesting /favicon.ico on the API origin
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
  res.sendFile(faviconPath, (err) => {
    if (err) {
      // If the file is missing or cannot be sent, return empty response
      res.status(204).end();
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));