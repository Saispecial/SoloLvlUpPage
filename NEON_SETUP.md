# Neon Database Setup Guide

This project is optimized for Neon, a serverless PostgreSQL database perfect for Vercel deployments.

## Why Neon?

✅ **Serverless-first** - Built for modern serverless applications  
✅ **Instant connections** - No cold start delays  
✅ **Auto-scaling** - Scales to zero when not in use  
✅ **Generous free tier** - 3GB storage, 100 compute hours/month  
✅ **Database branching** - Separate databases for different environments  

## Quick Setup

### 1. Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub, Google, or email
3. Verify your account

### 2. Create Your Database
1. Click **"Create Project"**
2. Choose a name (e.g., "solopromo-site")
3. Select a region (choose closest to your users)
4. Click **"Create Project"**

### 3. Get Your Connection String
1. In your Neon dashboard, go to **"Connection Details"**
2. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### 4. Set Up Environment Variables

**For Local Development:**
1. Update your `.env` file:
   ```
   DATABASE_URL=your_neon_connection_string_here
   PORT=5000
   ```

**For Vercel Deployment:**
1. In your Vercel dashboard, go to your project settings
2. Navigate to **Environment Variables**
3. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string
   - **Environment**: Production, Preview, Development

### 5. Initialize Your Database
```bash
# Install dependencies
npm install

# Create database tables
npm run db:push
```

## Database Branching (Optional)

Neon supports database branching for different environments:

1. **Main branch** - Production database
2. **Dev branch** - Development database  
3. **Preview branches** - For feature testing

To create branches:
1. Go to your Neon dashboard
2. Click **"Branches"** 
3. Click **"Create Branch"**
4. Use different connection strings for different environments

## Monitoring

- **Dashboard**: Monitor usage at [console.neon.tech](https://console.neon.tech)
- **Compute hours**: Track your monthly usage
- **Storage**: Monitor database size
- **Connections**: View active connections

## Free Tier Limits

- **Storage**: 3 GB
- **Compute**: 100 hours/month
- **Branches**: 10 per project
- **Databases**: 1 per branch

## Troubleshooting

### Connection Issues
- Ensure your connection string includes `?sslmode=require`
- Check that your Neon project is active (it auto-sleeps after inactivity)
- Verify the connection string is correctly copied

### Database Not Found
- Make sure you've run `npm run db:push` to create tables
- Check that your `DATABASE_URL` points to the correct database

### Compute Hours Exceeded
- Monitor usage in the Neon dashboard
- Consider upgrading to a paid plan for higher limits
- Database automatically scales to zero when not in use

## Support

- **Documentation**: [neon.tech/docs](https://neon.tech/docs)
- **Discord**: [Neon Community](https://discord.gg/92vNTzKDGp)
- **GitHub**: [neondatabase/neon](https://github.com/neondatabase/neon)