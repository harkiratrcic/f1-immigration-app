# Railway Deployment Guide

## Prerequisites
- GitHub account with your code pushed to a repository
- Railway account (sign up at https://railway.app)
- Railway CLI installed (optional): `npm install -g @railway/cli`

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create Railway Project

#### Option A: Via Railway Dashboard
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your repository

#### Option B: Via Railway CLI
```bash
railway login
railway init
railway link [project-id]
```

### 3. Add PostgreSQL Database
1. In Railway dashboard, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway automatically sets `DATABASE_URL` environment variable

### 4. Set Environment Variables
In Railway dashboard → Variables tab, add:
```
JWT_SECRET=your-secure-random-string-here
NODE_ENV=production
```

Optional variables (if using Supabase):
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Deploy
Railway will automatically:
1. Detect the `railway.json` configuration
2. Install dependencies with `npm ci`
3. Generate Prisma client
4. Build the React frontend
5. Run database migrations
6. Start the Express server

### 6. Access Your App
- Railway provides a URL like: `https://your-app.railway.app`
- Check deployment logs in Railway dashboard
- Monitor health at: `https://your-app.railway.app/api/health`

## Project Structure

- **Frontend**: React app built with Vite, served from `/dist`
- **Backend**: Express server on port 5000 (or $PORT)
- **Database**: PostgreSQL with Prisma ORM
- **Single Service**: Both frontend and backend run together

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL service is running in Railway
- Check that `DATABASE_URL` is set in Railway variables
- Migrations run automatically on deploy

### Build Failures
- Check logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify `prisma` and `@prisma/client` versions match

### Health Check Failures
- Endpoint: `/api/health`
- Should return JSON with status "ok"
- Check server logs for startup errors

## Local Development
```bash
# Install dependencies
npm install

# Set up local database
npx prisma migrate dev

# Run development servers
npm run dev:all
```

## Important Files
- `railway.json` - Railway configuration
- `package.json` - Dependencies and scripts
- `server/index.js` - Express server entry point
- `prisma/schema.prisma` - Database schema
- `.env.example` - Environment variables template