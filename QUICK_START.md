# Quick Start - Deployment Steps

Follow these steps to deploy your HSIT Calculator to Vercel with Supabase.

## 🗄️ Step 1: Set Up Supabase (5 minutes)

1. **Create project** at https://supabase.com/dashboard
   - Click "New Project"
   - Name: `hsit-calculator`
   - Set a strong database password (save it!)
   - Choose nearest region

2. **Get connection string**
   - Go to: Project Settings → Database → Connection string
   - Copy the URI (replace `[YOUR-PASSWORD]` with your actual password)
   - Format: `postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres`

3. **Create database tables**
   ```bash
   DATABASE_URL="your-connection-string" npx prisma db push
   ```

## 🚀 Step 2: Deploy to Vercel (5 minutes)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your repository

3. **Add environment variable**
   - Name: `DATABASE_URL`
   - Value: Your Supabase connection string from Step 1

4. **Deploy**
   - Click "Deploy"
   - Wait ~2-3 minutes
   - Visit your live site!

## ✅ Step 3: Verify (2 minutes)

1. Visit your deployed URL
2. Test the HSIT calculator form
3. Check Supabase Table Editor for data

---

**Need help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
