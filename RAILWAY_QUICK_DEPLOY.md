# Railway Deployment - Quick Guide

Your application is now ready for Railway deployment! Follow these steps:

## 1. Prerequisites
- Railway account (https://railway.app)
- Railway CLI installed (`npm install -g @railway/cli`)
- Git repository for your project

## 2. Deploy to Railway

### Option A: Deploy via CLI
```bash
# Login to Railway
railway login

# Initialize a new Railway project
railway init

# Add PostgreSQL database
railway add postgresql

# Deploy your application
railway up
```

### Option B: Deploy via GitHub
1. Push your code to GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Railway will auto-detect the configuration

## 3. Required Environment Variables

Add these in Railway dashboard (Settings → Variables):

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Frontend Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=/api

# Security
JWT_SECRET=your-secure-jwt-secret-here
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app

# Environment
NODE_ENV=production
```

## 4. Automatic Configuration

Railway will automatically:
- Provide `DATABASE_URL` for PostgreSQL
- Provide `PORT` for the server
- Run database migrations during build
- Build the Vite frontend
- Serve the application

## 5. Files Configured for Railway

✅ `package.json` - Build and start scripts configured
✅ `railway.json` - Railway-specific settings
✅ `nixpacks.toml` - Build configuration
✅ `server/index.js` - Handles production mode with static file serving
✅ `.env` - DATABASE_URL commented out (Railway provides it)
✅ `prisma/schema.prisma` - Ready for PostgreSQL

## 6. Health Check

After deployment, verify your app:
- Visit: `https://your-app.up.railway.app/api/health`
- Should return: `{"status":"ok","database":"connected"}`

## 7. Database Migrations

Railway will run migrations automatically during build. For manual migrations:

```bash
# Connect to Railway project
railway run npx prisma migrate deploy

# View database
railway run npx prisma studio
```

## 8. Monitoring

Check deployment logs:
```bash
railway logs
```

Or view in Railway dashboard → Deployments → View Logs

## Troubleshooting

1. **Build fails**: Check `railway logs` for errors
2. **Database connection issues**: Ensure PostgreSQL service is added
3. **Environment variables**: Verify all required vars are set in Railway dashboard
4. **Port issues**: Railway automatically sets PORT, don't override it

## Support

For Railway-specific issues: https://docs.railway.app
For application issues: Check the logs first, then review environment variables