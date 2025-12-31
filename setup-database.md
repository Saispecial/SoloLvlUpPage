# 🗄️ Database Setup Guide

## Step 1: Create Your Neon Database

1. **Go to Neon**: https://neon.tech
2. **Sign up/Login** with GitHub, Google, or email
3. **Create New Project**:
   - Project Name: `solopromo-site`
   - Region: Choose closest to your users (US East recommended for Vercel)
   - Click "Create Project"

## Step 2: Get Your Connection String

1. In your Neon dashboard, you'll see **"Connection Details"**
2. Copy the **connection string** (it looks like this):
   ```
   postgresql://username:password@ep-abc123-456.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

## Step 3: Update Local Environment

Replace the placeholder in your `.env` file with your real Neon connection string:

```bash
# Your real Neon connection string
DATABASE_URL=postgresql://your_username:your_password@ep-your-endpoint.us-east-1.aws.neon.tech/neondb?sslmode=require
PORT=5000
```

## Step 4: Add to Vercel

1. **Go to your Vercel dashboard**: https://vercel.com/sais-projects-d8ec182d/sololvluppage/settings/environment-variables
2. **Add Environment Variable**:
   - Name: `DATABASE_URL`
   - Value: Your Neon connection string
   - Environments: ✅ Production ✅ Preview ✅ Development
3. **Click "Save"**

## Step 5: Create Database Tables

Run this command to create your database tables:

```bash
npm run db:push
```

## Step 6: Redeploy to Vercel

```bash
vercel --prod
```

## ✅ Verification

After setup, your API endpoint should work:
- Test: https://sololvluppage-daya2h2vj-sais-projects-d8ec182d.vercel.app/api/contact

## 🔧 Troubleshooting

**If you get connection errors:**
1. Make sure your Neon database is active (check dashboard)
2. Verify the connection string is correct
3. Ensure `?sslmode=require` is at the end of the URL

**If tables don't exist:**
1. Run `npm run db:push` locally
2. Check Neon dashboard for tables in the "Tables" section