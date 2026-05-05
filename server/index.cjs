const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: true, message: 'Wallet server running' });
});

// Require routes after dotenv has loaded env variables
const walletRoutes = require('./walletRoutes.cjs');
const uploadRoutes = require('./uploadRoutes.cjs');
app.use('/api/wallet', walletRoutes);
app.use('/api/uploads', uploadRoutes);

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