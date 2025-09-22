# F1 Immigration inc. - Railway Deployment Guide

## Why Railway is Better for Your App 🚂

- ✅ **All-in-one**: Frontend + Backend + Database in one place
- ✅ **Simple setup**: No complex configuration files
- ✅ **Affordable**: $5/month (with $5 free credit to start)
- ✅ **Reliable**: Better for full-stack apps than Vercel
- ✅ **PostgreSQL included**: Professional database built-in

---

# Complete Step-by-Step Railway Deployment

## Step 1: Sign Up for Railway (5 minutes)

### 1.1 Create Railway Account
1. Go to **[railway.app](https://railway.app)**
2. Click **"Start a New Project"**
3. Click **"Login with GitHub"** (easiest way)
4. Click **"Authorize Railway"** when GitHub asks
5. You'll get **$5 in free credits** to start!

---

## Step 2: Push Your Updated Code to GitHub (5 minutes)

### 2.1 Update Your GitHub Repository
Since I just added Railway-specific files, you need to update your GitHub repo:

**Easy Method (Web Upload):**
1. Go to your GitHub repository
2. Click **"Add file"** → **"Upload files"**
3. Drag these new files from your computer:
   - `railway.json`
   - `Dockerfile`
   - `server/railway.js`
   - `RAILWAY_DEPLOYMENT.md`
4. Also upload the updated `package.json` and `prisma/schema.prisma`
5. Type commit message: "Add Railway deployment configuration"
6. Click **"Commit changes"**

**Command Line Method (if you prefer):**
```bash
cd /Users/harkiratsingh/Downloads/envoy-docs-main
git add .
git commit -m "Add Railway deployment configuration"
git push
```

---

## Step 3: Create Your Project on Railway (10 minutes)

### 3.1 Deploy from GitHub
1. In Railway dashboard, click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select your repository: **"f1-immigration-app"**
4. Railway will automatically detect it's a Node.js app ✅

### 3.2 Add PostgreSQL Database
1. After your app starts deploying, click **"+ New"** in your project
2. Select **"Database"**
3. Click **"PostgreSQL"**
4. Railway will create a database for you automatically! 🎉

### 3.3 Get Database Connection URL
1. Click on your **PostgreSQL service** (purple icon)
2. Go to **"Connect"** tab
3. Copy the **"Postgres Connection URL"** (starts with `postgresql://`)
4. **Save this** - you'll need it in the next step!

---

## Step 4: Configure Environment Variables (5 minutes)

### 4.1 Add Environment Variables to Your App
1. Click on your **main app service** (not the database)
2. Go to **"Variables"** tab
3. Add these variables one by one:

**Click "New Variable" for each:**

```
DATABASE_URL = [paste your PostgreSQL URL from Step 3.3]
NODE_ENV = production
PORT = 3000
JWT_SECRET = f1-immigration-secret-key-2024
```

### 4.2 Redeploy
1. Go to **"Deployments"** tab
2. Click **"Deploy Latest"**
3. Wait 3-5 minutes for deployment

---

## Step 5: Set Up Database Tables (5 minutes)

### 5.1 Run Database Migration
1. In Railway, click on your **main app service**
2. Go to **"Deployments"** tab
3. Click on the latest **successful deployment**
4. You should see logs showing "Database migrations completed" ✅

**If migrations didn't run automatically:**
1. Go to **"Settings"** tab in your app service
2. Scroll down to **"Deploy Command"**
3. Set it to: `npm run prisma:migrate:deploy && npm run start:railway`
4. Redeploy

---

## Step 6: Test Your Live App! (5 minutes)

### 6.1 Get Your App URL
1. In Railway dashboard, click your **main app service**
2. Go to **"Settings"** tab
3. Under **"Domains"**, you'll see your app URL like:
   `https://f1-immigration-inc-production.up.railway.app`

### 6.2 Visit Your App
1. **Click the URL** or copy it to a new browser tab
2. You should see your **F1 Immigration inc.** login page! 🎉

### 6.3 Create Admin User
Since this is your first time, create an admin user:

1. **Try to register** with your email on the login page
2. **Or manually add admin via database:**
   - In Railway, click your **PostgreSQL service**
   - Go to **"Data"** tab
   - Click on **"users"** table
   - Click **"Add Row"**
   - Fill in:
     - `email`: `admin@f1immigration.com`
     - `name`: `Your Name`
     - `role`: `ADMIN`
   - Click **"Save"**

---

## 🎉 Congratulations! Your App is Live!

Your F1 Immigration inc. system is now running at:
**`https://f1-immigration-inc-production.up.railway.app`**

## What You Have Now:
- ✅ **Live website** with your custom domain
- ✅ **PostgreSQL database** (much better than SQLite)
- ✅ **Automatic deployments** when you update code
- ✅ **Professional hosting** with 99.9% uptime
- ✅ **Built-in monitoring** and logs

## Cost Breakdown:
- **First month**: FREE (using $5 credit)
- **After that**: ~$5-10/month (depending on usage)
- **Database**: Included (no extra cost!)

## Managing Your App:

### To Update Your App:
1. Make changes to your code
2. Push to GitHub
3. Railway automatically deploys! 🚀

### To Monitor Your App:
1. Railway dashboard shows logs, metrics, and errors
2. Database usage and performance metrics
3. Automatic backups of your database

### To Add a Custom Domain:
1. In Railway app settings → "Domains"
2. Add your custom domain (like `app.f1immigration.com`)
3. Update DNS settings as instructed

---

## Troubleshooting

### If App Won't Start:
1. Check **"Deployments"** tab for error logs
2. Make sure all environment variables are set
3. Verify database URL is correct

### If Database Issues:
1. Check PostgreSQL service is running
2. Verify DATABASE_URL variable is set correctly
3. Look at deployment logs for migration errors

### Need Help?
- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: Very helpful community
- **Contact me**: If you get stuck!

---

**🚂 Welcome to the Railway! Your immigration practice is now digital!** 🎉