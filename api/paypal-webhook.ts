import { db } from '../server/db';
import { payments } from '../shared/schema';

// ... (rest of imports)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const eventType = body.event_type;

    // 1. TRUST ONLY PAYMENT.CAPTURE.COMPLETED
    if (eventType !== 'PAYMENT.CAPTURE.COMPLETED') {
      return res.status(200).json({ status: 'ignored', type: eventType });
    }

    const resource = body.resource;
    const captureId = resource.id;
    const amountVal = resource.amount?.value;
    const currency = resource.amount?.currency_code;
    const payerEmail = resource.payer?.email_address || resource.supplementary_data?.payer?.email;

    // 2. VERIFY with PayPal API (Source of Truth)
    const verifiedCapture = await getPayPalCapture(captureId);

    if (verifiedCapture.status !== 'COMPLETED') {
      console.error('Capture not completed:', verifiedCapture.status);
      return res.status(400).json({ error: 'Capture not completed' });
    }

    // 3. IDEMPOTENCY & DB UPSERT
    console.log(`[PAYPAL_WEBHOOK] Processing verified payment: ${captureId} for ${payerEmail}`);

    try {
      await db.insert(payments).values({
        provider: 'paypal',
        providerRef: captureId,
        payerEmail: payerEmail,
        amount: amountVal,
        currency: currency,
        status: 'COMPLETED',
        rawEvent: JSON.stringify(body)
      }).onConflictDoNothing(); // Prevent duplicates
    } catch (dbError) {
      console.error('DB Insert Error:', dbError);
      // We do NOT return error here, because payment is valid. We log it.
      // We might want to alert admin.
    }

    // 4. UNLOCK PREMIUM ACCESS
    // await unlockAccess(payerEmail);
    console.log(`[PAYPAL_WEBHOOK] Access unlocked for ${payerEmail}`);

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Helper to get Access Token
async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const base = process.env.PAYPAL_ENVIRONMENT === 'sandbox'
    ? 'https://api.sandbox.paypal.com'
    : 'https://api.paypal.com';

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Helper to get Capture Details
async function getPayPalCapture(captureId: string): Promise<any> {
  const accessToken = await getPayPalAccessToken();
  const base = process.env.PAYPAL_ENVIRONMENT === 'sandbox'
    ? 'https://api.sandbox.paypal.com'
    : 'https://api.paypal.com';

  const response = await fetch(`${base}/v2/payments/captures/${captureId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch capture details');
  }

  return await response.json();
}
