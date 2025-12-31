import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { z } from "zod";

// Import schema directly to avoid path issues in Vercel
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

// Define schema inline for Vercel compatibility
const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Configure Neon for serverless
neonConfig.fetchConnectionCache = true;

// Global connection for serverless functions
let db: any = null;

function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set");
    }
    
    // Validate DATABASE_URL format
    const dbUrl = process.env.DATABASE_URL;
    console.log('DATABASE_URL format check:', dbUrl.substring(0, 20) + '...');
    
    if (!dbUrl.startsWith('postgresql://')) {
      throw new Error("DATABASE_URL must be a valid PostgreSQL connection string");
    }
    
    try {
      // Use Neon's serverless driver for optimal performance
      const pool = new Pool({ connectionString: dbUrl });
      db = drizzle(pool, { schema: { contacts } });
      console.log('Database connection initialized successfully');
    } catch (error) {
      console.error('Database connection error:', error);
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  return db;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Add a simple GET endpoint for health check
  if (req.method === 'GET') {
    try {
      const database = getDb();
      return res.status(200).json({ 
        status: 'ok', 
        message: 'API is working',
        hasDatabase: !!process.env.DATABASE_URL,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const database = getDb();
    
    // Log the received data for debugging
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    // Validate input - using more lenient validation to match client
    const contactSchema = z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().min(1, "Email is required").email("Valid email is required"),
      message: z.string().min(1, "Message is required")
    });

    const input = contactSchema.parse(req.body);
    
    console.log('Validated input:', JSON.stringify(input, null, 2));
    
    // Insert contact into database
    const [contact] = await database
      .insert(contacts)
      .values({
        name: input.name,
        email: input.email,
        message: input.message,
      })
      .returning();

    console.log('Contact created successfully:', contact);
    res.status(201).json(contact);
  } catch (err) {
    console.error('Contact submission error:', err);
    
    if (err instanceof z.ZodError) {
      console.error('Validation errors:', err.errors);
      return res.status(400).json({
        message: err.errors[0].message,
        field: err.errors[0].path.join('.'),
        errors: err.errors // Include all errors for debugging
      });
    }
    
    res.status(500).json({ message: 'Internal server error', error: err instanceof Error ? err.message : 'Unknown error' });
  }
}