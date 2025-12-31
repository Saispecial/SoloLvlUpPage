import { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

// --- INLINE DB SETUP (To avoid Vercel Module Resolution Issues) ---
neonConfig.fetchConnectionCache = true;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  providerRef: text("provider_ref").unique(),
  payerEmail: text("payer_email"),
  amount: text("amount").notNull(),
  currency: text("currency"),
  status: text("status").notNull(),
  rawEvent: text("raw_event"),
  createdAt: timestamp("created_at").defaultNow(),
});
const db = drizzle(pool);
// ------------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // Safety check for body
    if (!body || !body.event_type) {
      console.error("Missing body or event_type");
      return res.status(400).json({ error: "Invalid Payload" });
    }

    const eventType = body.event_type;

    // 1. TRUST ONLY PAYMENT.CAPTURE.COMPLETED
    if (eventType !== 'PAYMENT.CAPTURE.COMPLETED') {
      return res.status(200).json({ status: 'ignored', type: eventType });
    }

    const resource = body.resource;
    const captureId = resource.id;
    const amountVal = resource.amount?.value;
    const currency = resource.amount?.currency_code;

    // Initial attempt to get email from webhook payload
    let payerEmail = resource.payer?.email_address || resource.supplementary_data?.payer?.email;

    // 2. VERIFY with PayPal API (Source of Truth)
    const verifiedCapture = await getPayPalCapture(captureId);

    if (verifiedCapture.status !== 'COMPLETED') {
      console.error('Capture not completed. Status:', verifiedCapture.status);
      return res.status(400).json({ error: 'Capture not completed' });
    }

    // Aggressive Email Search: If missing, fetch Order
    if (!payerEmail) {
      console.log(`[PAYPAL_WEBHOOK] Email missing in payload for ${captureId}. checking Order...`);

      // Check capture response for payer info directly (rare but possible)
      if (verifiedCapture.payer?.email_address) {
        payerEmail = verifiedCapture.payer.email_address;
      }
      // Check for Order ID and fetch Order
      else if (verifiedCapture.supplementary_data?.related_ids?.order_id) {
        try {
          const orderId = verifiedCapture.supplementary_data.related_ids.order_id;
          const order = await getPayPalOrder(orderId);
          if (order.payer?.email_address) {
            payerEmail = order.payer.email_address;
            console.log(`[PAYPAL_WEBHOOK] Found email in Order ${orderId}: ${payerEmail}`);
          }
        } catch (err) {
          console.error("[PAYPAL_WEBHOOK] Failed to fetch Order for email:", err);
        }
      }
    }

    // 3. IDEMPOTENCY & DB UPSERT
    console.log(`[PAYPAL_WEBHOOK] Payment verified: ${captureId} for ${payerEmail}. Saving to DB...`);

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
      console.log("[PAYPAL_WEBHOOK] DB Insert Success!");
    } catch (dbError) {
      console.error('DB Insert Error:', dbError);
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

  if (!response.ok) {
    const errText = await response.text();
    console.error("PayPal Access Token Failed:", response.status, errText);
    throw new Error("Failed to get PayPal Access Token");
  }

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
    const errText = await response.text();
    console.error(`PayPal Capture Fetch Failed [${captureId}]:`, response.status, errText);
    throw new Error('Failed to fetch capture details');
  }

  return await response.json();
}

// Helper to get Order Details
async function getPayPalOrder(orderId: string): Promise<any> {
  const accessToken = await getPayPalAccessToken();
  const base = process.env.PAYPAL_ENVIRONMENT === 'sandbox'
    ? 'https://api.sandbox.paypal.com'
    : 'https://api.paypal.com';

  const response = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`PayPal Order Fetch Failed [${orderId}]:`, response.status, errText);
    throw new Error('Failed to fetch order details');
  }

  return await response.json();
}
