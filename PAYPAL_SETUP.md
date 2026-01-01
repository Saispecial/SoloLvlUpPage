# Payment Integration Setup Guide
(Updated for Dual Payment Flow: PayPal + UPI)

## 🚀 Overview
Your SoloLvlUp site supports two payment methods with independent verification flows:
1. **PayPal ($2.00)**: Auto-verified via Webhook (Server Source of Truth).
2. **UPI (₹149)**: Manual verification via Google Form.

## 1. Database Schema (Critical)
You must create this table in your Neon DB to track payments and prevent duplicates.

```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(20) NOT NULL,         -- 'paypal' or 'upi'
  provider_ref VARCHAR(255) UNIQUE,      -- PayPal capture_id OR UPI transaction ID
  payer_email VARCHAR(255),              -- Email used for access (NULL for UPI until verified)
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(3),
  status VARCHAR(30) NOT NULL,           -- 'COMPLETED', 'PENDING', 'FAILED'
  raw_event JSONB,                       -- Store full webhook payload for debugging
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 2. PayPal Setup

### Environment Variables
Add these to your `.env` (and Vercel):
```env
# PayPal Credentials
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_ENVIRONMENT=sandbox  # Change to 'live' in production
VITE_PAYPAL_CLIENT_ID=your_client_id
```

### Webhook Configuration
1. Go to **PayPal Developer Dashboard** > **Apps & Credentials**.
2. Select your App.
3. Scroll to **Webhooks** > **Add Webhook**.
4. URL: `https://your-domain.com/api/paypal-webhook` (or ngrok for local dev).
5. **Event types**: Select **ONLY** `Payment capture completed`.
   - Do NOT select 'Order approved' or 'Subscription' events.

## 3. UPI Setup (Manual)
1. Create a Google Form to collect:
   - Name
   - Email
   - Transaction ID
   - Screenshot (Optional)
2. Add the Form Link to `PayPalGate.tsx` in the `handleUPI` function.

## 4. Testing

### PayPal Sandbox
1. Use a Sandbox Personal Account to pay.
2. Verify:
   - You are redirected to `/payment-success`.
   - The Webhook logs "Processing verified payment".
   - The Database has a new row with `status='COMPLETED'`.

### Idempotency Test
1. Replay the same webhook payload to your endpoint.
2. Verify the server does **not** create a duplicate DB entry.

## 5. Going Live Checklist
- [ ] Change `PAYPAL_ENVIRONMENT` to `live`.
- [ ] Update `PAYPAL_CLIENT_ID` and `SECRET` to Live credentials.
- [ ] Create a **Live Webhook** in PayPal Dashboard with the production URL.
- [ ] Update the Google Form link (if changed).
- [ ] Remove `onSkipPayment` demo props if used.

## 6. Support
- **PayPal Webhooks**: [Documentation](https://developer.paypal.com/docs/api/webhooks/)
- **Orders API**: [Documentation](https://developer.paypal.com/docs/api/orders/v2/)
