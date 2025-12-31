# 📋 Setup Checklist

## ✅ What You Need To Do Right Now:

### 1. Create Neon Database (5 minutes)
- [ ] Go to https://neon.tech
- [ ] Sign up/login
- [ ] Create new project named "solopromo-site"
- [ ] Copy your connection string

### 2. Update Local Environment
- [ ] Replace the DATABASE_URL in your `.env` file
- [ ] Test connection: `npm run db:test`
- [ ] Create tables: `npm run db:push`

### 3. Configure Vercel Environment
- [ ] Go to: https://vercel.com/sais-projects-d8ec182d/sololvluppage/settings/environment-variables
- [ ] Add DATABASE_URL with your Neon connection string
- [ ] Select all environments (Production, Preview, Development)

### 4. Redeploy
- [ ] Run: `vercel --prod`
- [ ] Test your API: https://sololvluppage-daya2h2vj-sais-projects-d8ec182d.vercel.app/api/contact

## 🔍 Quick Commands:

```bash
# Test database connection
npm run db:test

# Create database tables
npm run db:push

# Redeploy to Vercel
vercel --prod

# Pull Vercel env vars locally (optional)
vercel env pull .env.local
```

## 🚨 Common Issues:

**"DATABASE_URL must be set"**
- Update your .env file with real Neon connection string

**"password authentication failed"**
- Double-check your Neon connection string

**"relation does not exist"**
- Run `npm run db:push` to create tables

**API returns 500 error**
- Check Vercel function logs in dashboard
- Ensure DATABASE_URL is set in Vercel environment variables

## 📞 Need Help?

1. Check the `setup-database.md` file for detailed steps
2. Run `npm run db:test` to diagnose connection issues
3. Check your Vercel dashboard for deployment logs