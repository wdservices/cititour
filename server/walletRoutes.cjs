const express = require('express');
const axios = require('axios');

const router = express.Router();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.VITE_PAYSTACK_PUBLIC_KEY || process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

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
    if (!name || !email || !bank_code || !account_number) {
      return res.status(400).json({ status: false, message: 'name, email, bank_code and account_number are required' });
    }

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transferrecipient`,
      {
        type: type || 'nuban',
        name,
        email,
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

module.exports = router;