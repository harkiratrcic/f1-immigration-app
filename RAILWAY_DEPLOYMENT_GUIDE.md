# Complete Railway PostgreSQL Deployment Guide

## Prerequisites Completed ✅
- Fixed DATABASE_URL parsing issues
- Fixed Express routing compatibility
- Code pushed to GitHub repository

## Step-by-Step Deployment Instructions

### STEP 1: Access Railway Dashboard
1. Open your browser and go to [https://railway.app](https://railway.app)
2. Sign in with GitHub (recommended for automatic deployments)

### STEP 2: Create New Project
1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `harkiratrcic/f1-immigration-app`
4. Railway will automatically start deploying

### STEP 3: Add PostgreSQL Database
1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will create a PostgreSQL instance and automatically inject environment variables

### STEP 4: Configure Environment Variables
1. Click on your app service (not the database)
2. Go to **"Variables"** tab
3. Add these environment variables:

```env
# Application Settings
NODE_ENV=production
PORT=3000

# Supabase (if you're using it)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Frontend Variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=/api

# JWT Secret
JWT_SECRET=your-secure-jwt-secret
```

### STEP 5: Verify PostgreSQL Connection
Railway automatically provides these variables when you add PostgreSQL:
- `DATABASE_URL` (full connection string)
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

Our updated `server/railway.js` will automatically detect and use these.

### STEP 6: Configure Build Settings
1. Click on your app service
2. Go to **"Settings"** tab
3. Set these build configurations:

**Build Command:**
```bash
npm install && npm run build && npm run prisma:generate
```

**Start Command:**
```bash
npm run start:railway
```

**Root Directory:** (leave empty)

### STEP 7: Set Up Automatic Deployments
1. In Settings, enable **"Automatic Deployments"**
2. Choose branch: `main`
3. Now every push to main will trigger a deployment

### STEP 8: Run Database Migrations
After deployment, you need to run migrations:

**Option A: Using Railway CLI (Recommended)**
```bash
# Install Railway CLI if not installed
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migrations
railway run npm run prisma:migrate:deploy
```

**Option B: Using Railway Shell**
1. Click on your app service
2. Click **"Connect"** → **"Railway Shell"**
3. Run: `npm run prisma:migrate:deploy`

### STEP 9: Verify Deployment
1. Get your app URL from Railway dashboard
2. Test the health endpoint:
```bash
curl https://your-app-name.railway.app/api/health
```

Expected successful response:
```json
{
  "status": "ok",
  "message": "F1 Immigration Inc. server is running",
  "environment": "production",
  "database": "connected"
}
```

## Troubleshooting Guide

### Issue 1: Database Connection Failed
**Check in this order:**

1. **Verify PostgreSQL is attached:**
   - Go to Railway dashboard
   - Ensure PostgreSQL service shows as "Running"
   - Check if it's linked to your app

2. **Check environment variables:**
   ```bash
   railway variables
   ```
   Should show DATABASE_URL or PGHOST, PGUSER, etc.

3. **Check deployment logs:**
   - Click on your app service
   - Go to "Deployments" tab
   - Click on latest deployment
   - Check logs for connection details

### Issue 2: Build Failures
**Common solutions:**

1. **Prisma issues:**
   Add to build command:
   ```bash
   npx prisma generate --schema=./prisma/schema.prisma
   ```

2. **Memory issues:**
   Add environment variable:
   ```env
   NODE_OPTIONS=--max-old-space-size=4096
   ```

### Issue 3: 502 Bad Gateway
**This means app isn't starting properly:**

1. Check start command is correct: `npm run start:railway`
2. Ensure PORT environment variable uses Railway's injected port
3. Check logs for startup errors

### Issue 4: Migrations Not Running
**If migrations fail:**

1. First, generate Prisma client:
   ```bash
   railway run npx prisma generate
   ```

2. Then run migrations:
   ```bash
   railway run npx prisma migrate deploy
   ```

3. If still failing, reset database:
   ```bash
   railway run npx prisma migrate reset --force
   ```

## Monitoring Your Deployment

### Check Application Logs
```bash
railway logs
```

### Monitor Database
1. Go to PostgreSQL service in Railway
2. Click "Data" tab to see tables
3. Use "Query" tab to run SQL queries

### Health Monitoring
Set up monitoring by regularly checking:
```bash
curl https://your-app.railway.app/api/health
```

## Environment Variables Reference

### Required by Railway (Auto-provided)
- `DATABASE_URL` - Full PostgreSQL connection string
- `PGHOST` - Database host
- `PGPORT` - Database port (usually 5432)
- `PGUSER` - Database username
- `PGPASSWORD` - Database password
- `PGDATABASE` - Database name
- `PORT` - Application port (Railway provides this)

### Required by Your App
- `NODE_ENV=production`
- `JWT_SECRET` - Your JWT secret
- Supabase credentials (if using)

## Quick Commands Reference

```bash
# Login to Railway
railway login

# Link to project
railway link

# Check environment variables
railway variables

# View logs
railway logs

# Run commands in Railway environment
railway run [command]

# Open Railway dashboard
railway open
```

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Build settings configured
- [ ] Deployment successful
- [ ] Database migrations run
- [ ] Health endpoint returns "connected"
- [ ] Application accessible via Railway URL

## Support Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Your Repository](https://github.com/harkiratrcic/f1-immigration-app)

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure monitoring/alerts
3. Set up backup strategy
4. Configure staging environment

---

**Last Updated:** September 23, 2025
**Deployment Status:** Ready for Railway deployment with all fixes applied