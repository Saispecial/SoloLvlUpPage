# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/solopromo-site)

## Manual Deployment Steps

### 1. Set Up Your Neon Database

This project uses Neon, a serverless PostgreSQL database optimized for Vercel:

#### Creating your Neon database:
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string from the dashboard
4. Use it as your `DATABASE_URL` environment variable

### 2. Set Up Environment Variables

In your Vercel dashboard, add:
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### 3. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: GitHub Integration**
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy on every push

### 4. Run Database Migrations

After deployment, you need to create the database tables:

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Run migrations on your deployed project
vercel env pull .env.local
npm run db:push
```

## Environment Variables Needed

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

## Vercel Configuration

The project includes a `vercel.json` file that:
- Builds the React frontend as static files
- Sets up API routes as serverless functions
- Configures proper routing

## Database Setup

The project uses Neon (serverless PostgreSQL) with Drizzle ORM. The schema is defined in `shared/schema.ts`.

To set up your database:
1. Create a Neon database at [neon.tech](https://neon.tech)
2. Add the `DATABASE_URL` to your environment variables
3. Run `npm run db:push` to create tables

## API Endpoints

- `POST /api/contact` - Submit contact form

## Troubleshooting

### Build Errors
- Make sure all dependencies are installed
- Check that TypeScript compiles without errors: `npm run check`

### Database Connection Issues
- Verify your Neon `DATABASE_URL` is correct
- Ensure your Neon database is active (it auto-sleeps after inactivity)
- Check that you're using the correct connection string from Neon dashboard

### API Function Timeouts
- Vercel functions have a 10-second timeout on the Hobby plan
- Consider upgrading to Pro for longer timeouts if needed

## Why Neon?

Neon is the recommended database choice because:
- **Serverless-native**: Built for Vercel and other serverless platforms
- **Instant connections**: No cold start delays
- **Auto-scaling**: Scales to zero, only pay for what you use
- **Database branching**: Create separate databases for dev/staging/prod
- **Generous free tier**: 3GB storage, 100 compute hours/month

## Performance Optimization

- The build process creates optimized static assets
- API functions use optimized connection pooling for Neon
- Neon's serverless architecture eliminates connection overhead
- Consider adding caching headers for static assets

## Monitoring

- Use Vercel's built-in analytics
- Monitor function execution times in the Vercel dashboard
- Set up error tracking (Sentry, LogRocket, etc.) if needed