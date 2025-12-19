# HSIT Calculator - Deployment Guide

This guide will walk you through deploying the HSIT Calculator application to Vercel with Supabase as the database.

## Prerequisites

- ✅ Supabase account (https://supabase.com)
- ✅ Vercel account (https://vercel.com)
- ✅ Git repository (GitHub, GitLab, or Bitbucket)

## Part 1: Supabase Database Setup

### Step 1: Create a New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `hsit-calculator` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"** and wait for setup to complete (~2 minutes)

### Step 2: Get Database Connection String

1. In your Supabase project dashboard, click **"Project Settings"** (gear icon in sidebar)
2. Navigate to **"Database"** section
3. Scroll down to **"Connection string"** section
4. Select **"URI"** tab
5. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
6. Replace `[YOUR-PASSWORD]` with your actual database password
7. **Save this connection string** - you'll need it for Vercel

### Step 3: Initialize Database Schema

Run this command locally to create the database tables in Supabase:

```bash
# Set your Supabase connection string temporarily
DATABASE_URL="your-supabase-connection-string-here" npx prisma db push
```

**Verify in Supabase:**
1. Go to **"Table Editor"** in Supabase dashboard
2. You should see three tables: `User`, `HSITCalculatorInput`, and `HSITCalculatorResult`

---

## Part 2: Vercel Deployment

### Step 1: Push Code to Git Repository

If you haven't already, push your code to a Git repository:

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository:
   - Click **"Import"** next to your repository
   - If not listed, click **"Adjust GitHub App Permissions"** to grant access

### Step 3: Configure Project Settings

1. **Project Name**: Keep default or customize
2. **Framework Preset**: Should auto-detect as "Next.js"
3. **Root Directory**: Leave as `./`
4. **Build Command**: `npm run build` (should be auto-filled)
5. **Output Directory**: `.next` (should be auto-filled)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Supabase connection string from Part 1, Step 2 |

**Important:** Make sure to paste the complete connection string with your password included.

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (~2-3 minutes)
3. Once deployed, click **"Visit"** to see your live application

---

## Part 3: Verification

### Test the Deployment

1. **Visit your deployed URL** (e.g., `https://your-app.vercel.app`)
2. **Navigate to the HSIT Calculator** page
3. **Fill out and submit the form** with test data
4. **Verify in Supabase**:
   - Go to Supabase dashboard → **"Table Editor"**
   - Check `HSITCalculatorInput` table for new entries
   - Check `HSITCalculatorResult` table for calculation results

### Check Deployment Logs

If something goes wrong:
1. Go to Vercel dashboard → Your project
2. Click on the deployment
3. View **"Build Logs"** and **"Function Logs"**
4. Look for error messages

---

## Environment Variables Reference

### Required Variables

- **`DATABASE_URL`**: PostgreSQL connection string from Supabase
  - Format: `postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres`
  - Get from: Supabase Dashboard → Project Settings → Database → Connection string

### Optional Variables (if using NextAuth)

If you add authentication later, you'll need:
- `NEXTAUTH_URL`: Your Vercel deployment URL
- `NEXTAUTH_SECRET`: Random secret string (generate with `openssl rand -base64 32`)

---

## Troubleshooting

### Build Fails with Prisma Error

**Error:** `Prisma Client could not be generated`

**Solution:** The `postinstall` script in `package.json` should handle this automatically. If it persists:
1. Check that `package.json` has: `"postinstall": "prisma generate"`
2. Redeploy from Vercel dashboard

### Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
1. Verify `DATABASE_URL` in Vercel environment variables
2. Ensure password in connection string is correct
3. Check Supabase project is active (not paused)
4. Verify connection string format matches Supabase's URI format

### Application Loads but Forms Don't Work

**Solution:**
1. Check Vercel Function Logs for API errors
2. Verify database tables exist in Supabase
3. Test database connection by checking Supabase logs

### TypeScript or ESLint Errors During Build

**Solution:** The configuration already ignores these during builds via `next.config.ts`. If errors persist:
1. Check Vercel build logs for specific errors
2. Ensure all dependencies are in `package.json`

---

## Updating Your Deployment

### Deploy New Changes

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Manual Redeploy

From Vercel dashboard:
1. Go to your project
2. Click **"Deployments"** tab
3. Click **"..."** menu on latest deployment
4. Select **"Redeploy"**

### Update Environment Variables

1. Go to Vercel dashboard → Your project
2. Click **"Settings"** → **"Environment Variables"**
3. Edit or add variables
4. Redeploy for changes to take effect

---

## Database Management

### View Data

Use Supabase Table Editor:
1. Go to Supabase dashboard
2. Click **"Table Editor"**
3. Select table to view/edit data

### Backup Database

Supabase automatically backs up your database. To create manual backup:
1. Go to Supabase dashboard → **"Database"**
2. Click **"Backups"**
3. Click **"Create backup"**

### Update Schema

To modify database schema:

1. Update `prisma/schema.prisma` locally
2. Run: `DATABASE_URL="your-supabase-url" npx prisma db push`
3. Commit and push changes
4. Vercel will automatically redeploy

---

## Production Checklist

- [ ] Database is set up in Supabase
- [ ] Tables are created and visible in Supabase
- [ ] Environment variables are set in Vercel
- [ ] Application deploys successfully
- [ ] Forms submit and save data to database
- [ ] Data appears in Supabase Table Editor
- [ ] Custom domain configured (optional)
- [ ] SSL certificate is active (automatic with Vercel)

---

## Next Steps

### Add Custom Domain (Optional)

1. Go to Vercel dashboard → Your project → **"Settings"** → **"Domains"**
2. Add your domain
3. Configure DNS records as instructed
4. Wait for DNS propagation (~24 hours)

### Monitor Performance

- **Vercel Analytics**: Enable in project settings for traffic insights
- **Supabase Logs**: Monitor database queries and performance

### Scale Your Application

- **Vercel**: Automatically scales with traffic
- **Supabase**: Free tier includes 500MB database, upgrade as needed

---

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs

---

**Deployment Complete! 🎉**

Your HSIT Calculator is now live and accessible worldwide via Vercel with a robust Supabase PostgreSQL database.
