import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security headers (relaxed for Vite dev scripts & OAuth popups)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
    })
  );

  // CORS
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Strict rate limiter for payment endpoints
  const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: false, message: 'Too many payment attempts, please try again later.' },
  });

  // Raw body for Paystack webhook signature verification (must be BEFORE express.json)
  app.use('/api/wallet/webhook', express.raw({ type: 'application/json' }));

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Wallet & Upload Routes
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const walletRoutes = require('./server/walletRoutes.cjs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const uploadRoutes = require('./server/uploadRoutes.cjs');

  app.use('/api/wallet', paymentLimiter, walletRoutes);
  app.use('/api/uploads', uploadRoutes);

  // Static assets — ensure public files (citivas-logo.png, etc.) are served in both dev and prod
  // In dev, vite middlwares also serves public, but explicit static guarantees correct MIME and avoids SPA fallback returning HTML for images
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Favicon handler (kept for explicit cache control)
  app.get('/favicon.ico', (req, res, next) => {
    const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');
    res.sendFile(faviconPath, (err) => {
      if (err) next();
    });
  });

  // Vite middleware for development vs Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
