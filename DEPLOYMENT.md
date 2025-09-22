# F1 Immigration inc. - Vercel + Supabase Deployment Guide

## Overview
This guide will help you deploy your F1 Immigration inc. client intake system using Vercel for hosting and Supabase for the database and authentication.

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)

## Step 1: Set up Supabase Project

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Set project name: `f1-immigration-inc`
5. Set database password (save this securely)
6. Choose region closest to your users
7. Click "Create new project"

### 1.2 Run Database Migration
1. In your Supabase dashboard, go to "SQL Editor"
2. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
3. Paste it in the SQL Editor and click "Run"
4. Verify tables are created in the "Table Editor"

### 1.3 Configure Authentication
1. In Supabase dashboard, go to "Authentication" > "Settings"
2. Under "Site URL", add your domain (initially use `https://your-app-name.vercel.app`)
3. Under "Redirect URLs", add:
   - `https://your-app-name.vercel.app/auth/callback`
   - `http://localhost:8080/auth/callback` (for development)

### 1.4 Enable Google Authentication (Optional)
1. Go to "Authentication" > "Providers"
2. Enable "Google"
3. Add your Google OAuth credentials:
   - Client ID from Google Cloud Console
   - Client Secret from Google Cloud Console
   - Redirect URL: `https://your-project-ref.supabase.co/auth/v1/callback`

### 1.5 Get Supabase Credentials
1. Go to "Settings" > "API"
2. Copy these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJ...` (public key)
   - **service_role key**: `eyJ...` (secret key)

## Step 2: Prepare Your Code

### 2.1 Update Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```bash
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=/api
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   JWT_SECRET=your-random-jwt-secret
   ```

### 2.2 Test Locally (Optional)
```bash
npm install
npm run build
npm run preview
```

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub Repository
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project"
4. Import your GitHub repository
5. Select the repository: `f1-immigration-inc`

### 3.2 Configure Build Settings
Vercel should auto-detect the settings, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install --legacy-peer-deps`

### 3.3 Add Environment Variables
In Vercel project settings > Environment Variables, add:

**Production Variables:**
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=/api
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
JWT_SECRET=your-random-jwt-secret
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. You'll get a URL like: `https://f1-immigration-inc.vercel.app`

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain in Vercel
1. In Vercel project settings > Domains
2. Add your custom domain (e.g., `app.f1immigration.com`)
3. Configure DNS settings as instructed

### 4.2 Update Supabase URLs
1. In Supabase dashboard > Authentication > Settings
2. Update "Site URL" to your custom domain
3. Update redirect URLs to use your custom domain

## Step 5: Post-Deployment Setup

### 5.1 Create Admin User
1. Go to your deployed app
2. Try to sign up with your admin email
3. Or manually insert admin user in Supabase:
   ```sql
   INSERT INTO auth.users (email, email_confirmed_at, created_at, updated_at)
   VALUES ('admin@f1immigration.com', NOW(), NOW(), NOW());

   INSERT INTO users (email, name, role)
   VALUES ('admin@f1immigration.com', 'F1 Immigration Admin', 'ADMIN');
   ```

### 5.2 Test Core Features
1. **Login**: Test authentication
2. **Add Client**: Create a test client
3. **Send Form**: Send a form invite
4. **Form Submission**: Test form completion flow

### 5.3 Configure Email (Optional)
For production email sending:
1. Set up SMTP credentials in environment variables
2. Configure email templates in Supabase
3. Test email delivery

## Step 6: Monitoring and Maintenance

### 6.1 Set up Monitoring
1. **Vercel Analytics**: Enable in project settings
2. **Supabase Monitoring**: Check database usage
3. **Error Tracking**: Monitor function logs

### 6.2 Backup Strategy
1. **Database**: Supabase provides automatic backups
2. **Code**: Ensure GitHub repository is backed up
3. **Environment Variables**: Store securely

### 6.3 Scaling Considerations
- **Vercel**: Auto-scales with traffic
- **Supabase**: Monitor database usage and upgrade plan if needed
- **Email**: Consider dedicated email service for high volume

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check environment variables are set correctly
2. **Database Connection**: Verify Supabase credentials
3. **Authentication Redirect**: Check redirect URLs in Supabase settings
4. **Build Failures**: Check Node.js version and dependencies

### Support Resources
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Project Repository**: Check GitHub issues

## Cost Estimation

### Free Tier Limits:
- **Vercel**: 100GB bandwidth, unlimited sites
- **Supabase**: 500MB database, 2GB bandwidth, 50,000 monthly active users

### Paid Plans:
- **Vercel Pro**: $20/month (more bandwidth, analytics)
- **Supabase Pro**: $25/month (8GB database, 250GB bandwidth)

For a small immigration practice, the free tiers should handle initial usage well.

## Security Checklist

- [ ] Environment variables are properly set
- [ ] Database Row Level Security (RLS) is enabled
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] JWT secrets are strong and unique
- [ ] Backup strategy is in place
- [ ] Access logs are monitored
- [ ] User permissions are properly configured

---

**Need Help?** Contact the development team or check the project documentation for additional support.