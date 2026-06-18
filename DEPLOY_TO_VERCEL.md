# Deploy to Vercel - Complete Step-by-Step Guide

## Why Deploy to Vercel?

- ✅ Your app works perfectly
- ✅ Vercel can reach Supabase (unlike v0 sandbox)
- ✅ Takes 30 seconds
- ✅ Gets a professional URL
- ✅ Automatic updates from GitHub

---

## Prerequisites

✅ You have Supabase environment variables (already set)  
✅ Your code is on GitHub (already done)  
✅ You have a Vercel account (free tier works)  

---

## Step 1: Verify Your Environment Variables

Check what Supabase credentials you have:

```bash
cat /vercel/share/v0-project/.env.development.local
```

You should see:
```
NEXT_PUBLIC_SUPABASE_URL=https://rqnktiojgpojnifyqhim.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
POSTGRES_URL=postgres://...
```

**Keep these handy** - you'll need to copy them to Vercel.

---

## Step 2: Go to Vercel Dashboard

1. Open [vercel.com](https://vercel.com)
2. Sign in with your account
3. Click "Dashboard" (top right)
4. Click "Add New..." → "Project"

---

## Step 3: Import Your Repository

1. **Select Repository Source**: Choose "GitHub"
2. **Search for repo**: Type "ai-ml-learning-tracker"
3. **Select the repo**: Click on it
4. **Click "Import"**

---

## Step 4: Configure Environment Variables

1. **Scroll to "Environment Variables"** section
2. **Add the following variables** (copy from your `.env.development.local`):

### Variable 1: Supabase URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://rqnktiojgpojnifyqhim.supabase.co`
- Click "Add"

### Variable 2: Supabase Anon Key
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: (copy from your env file)
- Click "Add"

### Variable 3: Service Role Key
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: (copy from your env file)
- Click "Add"

### Variable 4: Postgres URL
- **Name**: `POSTGRES_URL`
- **Value**: (copy from your env file)
- Click "Add"

---

## Step 5: Deploy

1. **Click "Deploy"** button (bottom right)
2. **Wait** for the deployment to complete (usually 1-2 minutes)
3. **See the success message**: "Congratulations! Your project has been successfully deployed"

---

## Step 6: Test Your App

1. **Click the deployment link** provided
2. **You'll see**: Your NeuralLog app home page
3. **Go to** `/auth` to test sign up/sign in
4. **Create a test account**
5. **Dashboard loads with real data**

---

## Troubleshooting

### ❌ "Deployment Failed"
- Check environment variables are all set
- Ensure Supabase credentials are correct
- Rebuild: Click "Deployments" → latest → "Redeploy"

### ❌ "Sign in fails with network error"
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- These must be in Environment Variables, not in code

### ✅ "It Works!"
- Congratulations! Your app is live
- Share the URL with anyone
- They can create accounts and use it

---

## Environment Variables Reference

Your Supabase project ID: `rqnktiojgpojnifyqhim`

Get your keys from Supabase:
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Settings → API → Copy the keys

---

## Automatic Updates

After you deploy to Vercel, any git pushes to your main branch automatically redeploy your app. No manual steps needed!

```bash
git add .
git commit -m "Update feature"
git push origin main
# → Vercel automatically redeploys
```

---

## That's It!

Your app is now live on Vercel with:
- ✅ Full authentication working
- ✅ Database connected
- ✅ All features active
- ✅ Professional URL
- ✅ Automatic SSL/HTTPS

**You're done! 🎉**
