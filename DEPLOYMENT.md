# Deployment Instructions for N8N Workshop

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Prepare Repository

1. **Initialize Git repository**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: N8N Workshop platform with admin features"
   ```

2. **Push to GitHub**:
   ```bash
   # Create a new repository on GitHub named 'n8n-workshop'
   git remote add origin https://github.com/yourusername/n8n-workshop.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Visit Vercel Dashboard**:

   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**:

   - Click "New Project"
   - Import your `n8n-workshop` repository
   - Set project name: `n8n-workshop`

3. **Configure Build Settings**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 3: Environment Variables

Set these environment variables in Vercel dashboard:

#### Required Variables

```
DATABASE_URL=your-production-supabase-database-url
AUTH_SECRET=generate-random-32-character-string
NEXTAUTH_SECRET=same-as-auth-secret
NEXTAUTH_URL=https://n8n-workshop.vercel.app
```

#### OAuth Configuration

```
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

#### S3 Storage (Supabase or AWS)

```
R2_ENDPOINT=your-s3-endpoint
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET=your-bucket-name
R2_PUBLIC_BASE_URL=your-public-base-url
```

### Step 4: Database Setup

1. **Supabase Setup** (if using Supabase):

   - Create new project at [supabase.com](https://supabase.com)
   - Get connection string from Settings > Database
   - Enable Row Level Security if needed

2. **Database Migration**:
   ```bash
   # After deployment, run this via Vercel CLI or manual SQL
   npx prisma db push
   ```

### Step 5: OAuth Setup

1. **Google OAuth**:

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://n8n-workshop.vercel.app/api/auth/callback/google`

2. **Facebook OAuth**:
   - Go to [Facebook Developers](https://developers.facebook.com)
   - Create Facebook app
   - Add redirect URI: `https://n8n-workshop.vercel.app/api/auth/callback/facebook`

### Step 6: Post-Deployment

1. **Test Admin Access**:

   - Visit: `https://n8n-workshop.vercel.app/admin`
   - Create admin user (development auto-login won't work in production)

2. **Verify Features**:
   - User authentication (Google/Facebook)
   - File upload to S3
   - Workflow creation and download
   - Admin profile editing

## 🔧 Manual Database Setup (if needed)

If database migration fails, run these SQL commands manually:

```sql
-- Add role column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER';

-- Add folderPath column to Workflow table
ALTER TABLE "Workflow" ADD COLUMN IF NOT EXISTS "folderPath" TEXT;

-- Update existing admin users
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'your-admin-email@example.com';
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**:

   - Check TypeScript errors: `npm run build`
   - Ensure all environment variables are set
   - Verify Prisma schema is valid

2. **Database Connection**:

   - Test connection string locally
   - Check Supabase project status
   - Verify connection pooling settings

3. **OAuth Issues**:

   - Double-check redirect URLs
   - Ensure OAuth apps are configured correctly
   - Verify environment variables are set

4. **S3 Storage Issues**:
   - Test S3 credentials locally
   - Check bucket permissions
   - Verify CORS settings if needed

### Performance Tips

1. **Optimize Build**:

   - Enable Next.js static optimization
   - Use environment-specific configs
   - Monitor bundle size

2. **Database Performance**:
   - Use connection pooling
   - Add database indexes as needed
   - Monitor query performance

## 📱 Mobile Optimization

The platform is already mobile-responsive, but verify:

- Admin dashboard works on mobile
- File upload works on mobile devices
- Navigation is touch-friendly

## 🔒 Security Checklist

- [ ] Environment variables are properly set
- [ ] OAuth redirect URLs are configured
- [ ] Database has proper access controls
- [ ] S3 bucket has appropriate permissions
- [ ] HTTPS is enabled (automatic with Vercel)

---

**Live URL**: https://n8n-workshop.vercel.app
**Admin Dashboard**: https://n8n-workshop.vercel.app/admin
