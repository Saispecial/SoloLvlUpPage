# SoloPromo Site

A modern web application built with React, TypeScript, and Express, now optimized for Vercel deployment.

## Features

- React frontend with TypeScript
- Express.js API backend
- PostgreSQL database integration
- Tailwind CSS for styling
- Drizzle ORM for database operations

## Deployment on Vercel

### Prerequisites

1. A Vercel account
2. A Neon database (serverless PostgreSQL optimized for Vercel)

### Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo>
   cd SoloPromo-Site
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file or set these in your Vercel dashboard:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```

3. **Database Setup**
   Create a Neon database:
   ```bash
   # Go to neon.tech and create a project
   # Copy your connection string
   # Add it to your environment variables
   npm run db:push
   ```

4. **Deploy to Vercel**
   ```bash
   npx vercel
   ```
   Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables in Vercel

In your Vercel dashboard, add the following environment variables:
- `DATABASE_URL`: Your PostgreSQL connection string

### Local Development

1. Install dependencies: `npm install`
2. Set up your `.env` file with `DATABASE_URL`
3. Run database migrations: `npm run db:push`
4. Start development server: `npm run dev`

The app will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/contact` - Submit contact form

## Project Structure

```
├── api/                 # Vercel serverless functions
├── client/             # React frontend
├── server/             # Express server (for local dev)
├── shared/             # Shared types and schemas
├── dist/               # Build output
└── vercel.json         # Vercel configuration
```

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js (local), Vercel Functions (production)
- **Database**: Neon (serverless PostgreSQL) with Drizzle ORM
- **Deployment**: Vercel