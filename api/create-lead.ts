import { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

// --- INLINE DB SETUP ---
neonConfig.fetchConnectionCache = true;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const leads = pgTable("leads", {
    sessionId: text("session_id").primaryKey(),
    email: text("email").notNull(),
    paid: boolean("paid").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});
// -----------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sessionId, email } = req.body;

        if (!sessionId || !email) {
            return res.status(400).json({ error: 'Missing sessionId or email' });
        }

        // Upsert logic: if session exists, update email.
        // The user might restart the flow.
        await db.insert(leads).values({
            sessionId,
            email,
            paid: false
        }).onConflictDoUpdate({
            target: leads.sessionId,
            set: { email }
        });

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Create Lead Error:', error);
        res.status(500).json({ error: 'Failed to create lead' });
    }
}
