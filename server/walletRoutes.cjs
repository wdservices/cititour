const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const router = express.Router();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.VITE_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const WITHDRAWAL_FEE_PERCENT = Number(process.env.WITHDRAWAL_FEE_PERCENT ?? 0.015);

function computeWithdrawalFee(grossAmount) {
  const fee = Math.round(grossAmount * WITHDRAWAL_FEE_PERCENT * 100) / 100;
  const netAmount = Math.round((grossAmount - fee) * 100) / 100;
  return { fee, netAmount };
}

// Frontend config: expose Paystack public key
router.get('/config', async (req, res) => {
  try {
    return res.json({
      status: true,
      public_key: PAYSTACK_PUBLIC_KEY || null,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error loading config' });
  }
});

// Initialize wallet top-up (Paystack payment link)
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, callback_url } = req.body; // amount in Naira

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ status: false, message: 'Missing PAYSTACK_SECRET_KEY' });
    }
    if (!email || !amount) {
      return res.status(400).json({ status: false, message: 'Email and amount are required' });
    }

    const finalCallback = callback_url || process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:5173/wallet/verify';

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(Number(amount) * 100), // convert to Kobo
        callback_url: finalCallback,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.json({
      status: true,
      authorization_url: response?.data?.data?.authorization_url,
      reference: response?.data?.data?.reference,
    });
  } catch (error) {
    const msg = error?.response?.data || { message: error.message };
    console.error('Paystack initialize error:', msg);
    return res.status(500).json({ status: false, message: 'Error initializing payment', error: msg });
  }
});

// Verify payment after successful Paystack checkout
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ status: false, message: 'Missing PAYSTACK_SECRET_KEY' });
    }
    if (!reference) {
      return res.status(400).json({ status: false, message: 'Reference is required' });
    }

    const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const data = response?.data?.data;
    if (data?.status === 'success') {
      // Return normalized fields for frontend to update wallet
      return res.json({
        status: true,
        message: 'Wallet funded successfully',
        amount: (data.amount || 0) / 100,
        currency: data.currency || 'NGN',
        reference: data.reference,
        channel: data.channel,
        paid_at: data.paid_at,
        customer: { email: data?.customer?.email },
      });
    }

    return res.status(400).json({ status: false, message: 'Payment not successful', data });
  } catch (error) {
    const msg = error?.response?.data || { message: error.message };
    console.error('Paystack verify error:', msg);
    return res.status(500).json({ status: false, message: 'Error verifying payment', error: msg });
  }
});

// Withdraw from wallet (Paystack Transfer)
router.post('/withdraw', async (req, res) => {
  try {
    const { amount, recipient_code, reason } = req.body; // recipient_code from Paystack Recipient API
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ status: false, message: 'Missing PAYSTACK_SECRET_KEY' });
    }
    if (!amount || !recipient_code) {
      return res.status(400).json({ status: false, message: 'Amount and recipient_code are required' });
    }

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transfer`,
      {
        source: 'balance',
        amount: Math.round(Number(amount) * 100),
        recipient: recipient_code,
        reason: reason || 'Wallet withdrawal',
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.json({
      status: true,
      message: 'Withdrawal initiated successfully',
      data: response?.data?.data,
    });
  } catch (error) {
    const msg = error?.response?.data || { message: error.message };
    console.error('Paystack withdraw error:', msg);
    return res.status(500).json({ status: false, message: 'Error processing withdrawal', error: msg });
  }
});

// Create Paystack Transfer Recipient
router.post('/recipient', async (req, res) => {
  try {
    const { name, email, bank_code, account_number, currency, type } = req.body;
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ status: false, message: 'Missing PAYSTACK_SECRET_KEY' });
    }
    if (!name || !bank_code || !account_number) {
      return res.status(400).json({ status: false, message: 'name, bank_code and account_number are required' });
    }

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transferrecipient`,
      {
        type: type || 'nuban',
        name,
        email: email || '',
        bank_code,
        account_number,
        currency: currency || 'NGN',
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.json({
      status: true,
      message: 'Recipient created successfully',
      recipient_code: response?.data?.data?.recipient_code,
      data: response?.data?.data,
    });
  } catch (error) {
    const msg = error?.response?.data || { message: error.message };
    console.error('Paystack recipient error:', msg);
    return res.status(500).json({ status: false, message: 'Error creating recipient', error: msg });
  }
});

// ── NEW ENDPOINTS ──

// List Nigerian banks (for withdrawal dropdown)
router.get('/banks', async (req, res) => {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ status: false, message: 'Missing PAYSTACK_SECRET_KEY' });
    }
    const response = await axios.get(`${PAYSTACK_BASE_URL}/bank?country=nigeria`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    return res.json({ status: true, data: response.data.data });
  } catch (error) {
    console.error('Paystack banks error:', error?.response?.data || error.message);
    return res.status(500).json({ status: false, message: 'Could not fetch bank list' });
  }
});

// Resolve account number to verify it's real before saving
router.get('/resolve-account', async (req, res) => {
  try {
    const { account_number, bank_code } = req.query;
    if (!account_number || !bank_code) {
      return res.status(400).json({ status: false, message: 'account_number and bank_code are required' });
    }
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ status: false, message: 'Missing PAYSTACK_SECRET_KEY' });
    }
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );
    return res.json({ status: true, data: response.data.data });
  } catch (error) {
    console.error('Paystack resolve-account error:', error?.response?.data || error.message);
    return res.status(400).json({ status: false, message: 'Could not resolve account — check the number and bank' });
  }
});

// Preview withdrawal fee breakdown before user confirms
router.post('/withdraw/preview', (req, res) => {
  const grossAmount = Number(req.body?.amount);
  if (!grossAmount || grossAmount <= 0) {
    return res.status(400).json({ status: false, message: 'A valid amount is required' });
  }
  const { fee, netAmount } = computeWithdrawalFee(grossAmount);
  return res.json({ status: true, gross_amount: grossAmount, fee, net_amount: netAmount });
});

// Webhook: source of truth for crediting wallets on successful payment
// NOTE: This route receives raw body for signature verification.
// Mount this BEFORE any global express.json() middleware, or configure
// express.raw() specifically for this route.
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const rawBody = req.body; // should be a Buffer from express.raw()

    if (!PAYSTACK_SECRET_KEY) {
      return res.sendStatus(500);
    }

    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature) {
      console.warn('Paystack webhook: invalid signature, ignoring');
      return res.sendStatus(401);
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data;
      const userId = metadata?.userId;
      const nairaAmount = (amount || 0) / 100;

      console.log(`Webhook: charge.success for user ${userId}, amount ₦${nairaAmount}, ref ${reference}`);

      // TODO: In production, check if this reference was already processed
      // (idempotency) and credit the wallet in your database.
      // For now, log it — the client-side verify also credits the wallet
      // as a fallback, but the webhook is the authoritative source.
    }

    // Always acknowledge quickly — Paystack retries if you don't respond fast
    return res.sendStatus(200);
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.sendStatus(200); // still acknowledge to prevent retries on parse errors
  }
});

module.exports = router;