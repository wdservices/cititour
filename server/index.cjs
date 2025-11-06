const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const walletRoutes = require('./walletRoutes.cjs');

dotenv.config();
const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: true, message: 'Wallet server running' });
});

app.use('/api/wallet', walletRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));