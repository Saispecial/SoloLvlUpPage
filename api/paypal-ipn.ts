import { VercelRequest, VercelResponse } from '@vercel/node';

// DEPRECATED: usage of IPN is replaced by Webhooks in paypal-webhook.ts
// This file can be deleted once migration is confirmed.

// PayPal IPN (Instant Payment Notification) handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify IPN with PayPal
    const verifyUrl = process.env.PAYPAL_ENVIRONMENT === 'live'
      ? 'https://ipnpb.paypal.com/cgi-bin/webscr'
      : 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr';

    const verifyBody = 'cmd=_notify-validate&' + new URLSearchParams(req.body).toString();

    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verifyBody,
    });

    const verifyResult = await verifyResponse.text();

    if (verifyResult === 'VERIFIED') {
      const {
        txn_type,
        subscr_id,
        payer_email,
        payment_status,
        mc_gross,
        item_name,
      } = req.body;

      console.log('PayPal IPN verified:', {
        txn_type,
        subscr_id,
        payer_email,
        payment_status,
      });

      // Handle different transaction types
      switch (txn_type) {
        case 'subscr_signup':
          // New subscription created
          console.log('New subscription:', subscr_id);
          break;

        case 'subscr_payment':
          // Recurring payment received
          if (payment_status === 'Completed') {
            console.log('Payment completed for subscription:', subscr_id);
            // Update subscription status in database
          }
          break;

        case 'subscr_cancel':
          // Subscription cancelled
          console.log('Subscription cancelled:', subscr_id);
          // Update subscription status in database
          break;

        case 'subscr_eot':
          // Subscription expired
          console.log('Subscription expired:', subscr_id);
          // Update subscription status in database
          break;
      }

      res.status(200).json({ status: 'verified' });
    } else {
      console.error('PayPal IPN verification failed');
      res.status(400).json({ error: 'IPN verification failed' });
    }

  } catch (error) {
    console.error('PayPal IPN error:', error);
    res.status(500).json({ error: 'IPN processing failed' });
  }
}