// Simple database connection test
import { Pool, neonConfig } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Neon
neonConfig.fetchConnectionCache = true;

async function testConnection() {
  console.log("🔍 Testing Neon database connection...");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment variables");
    console.log("💡 Make sure to update your .env file with your Neon connection string");
    process.exit(1);
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    console.log("🔗 Connecting to database...");
    const client = await pool.connect();
    
    console.log("✅ Connected successfully!");
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time');
    console.log("🕐 Database time:", result.rows[0].current_time);
    
    client.release();
    await pool.end();
    
    console.log("🎉 Database connection test passed!");
    
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);
    
    if (error.message.includes("password authentication failed")) {
      console.log("💡 Check your username/password in the connection string");
    } else if (error.message.includes("does not exist")) {
      console.log("💡 Check your database name in the connection string");
    } else if (error.message.includes("timeout")) {
      console.log("💡 Check your internet connection and Neon endpoint");
    }
    
    process.exit(1);
  }
}

testConnection();