# 🚀 Deployment Guide for Shamiur's Portfolio

## 📋 Quick Deployment Options

### **Option 1: Vercel (Recommended)**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from project root
vercel

# 4. Deploy to production
vercel --prod
```

### **Option 2: Netlify**
```bash
# 1. Build the project
npm run build

# 2. Deploy using Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=.next

# OR drag-and-drop the .next folder to netlify.com
```

### **Option 3: AWS Amplify**
1. Connect your GitHub repository to AWS Amplify
2. Set build settings: `npm run build`
3. Deploy automatically on push to main branch

## ⚙️ Environment Setup

### **1. Create Production Environment Variables**
Copy `.env.production.example` to `.env.production` and fill in:

```bash
# Required Variables
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-very-strong-secret-key-here"
DATABASE_URL="your-production-database-url"

# Email Configuration
EMAIL_SERVER_HOST="smtp.your-provider.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@domain.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@domain.com"
ADMIN_EMAIL="your-admin-email@domain.com"
```

### **2. Generate Secure Secrets**
```bash
# Generate NextAuth secret
openssl rand -base64 32

# Or use online generator for strong secrets
```

## 🗄️ Database Setup

### **Option A: Vercel Postgres (Recommended)**
1. Go to Vercel dashboard → Storage → Create Database
2. Select Postgres
3. Copy connection string to `DATABASE_URL`
4. Run: `npm run db:push`

### **Option B: Supabase**
1. Create account at supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Run: `npm run db:push`

### **Option C: Railway**
1. Create account at railway.app
2. Add PostgreSQL service
3. Get connection string
4. Run: `npm run db:push`

## 📧 Email Configuration

### **Gmail (Development)**
```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password  # Use App Password, not regular password
```

### **SendGrid (Production)**
```bash
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=YOUR_SENDGRID_API_KEY
```

## 🌐 Domain Configuration

### **Vercel Custom Domain**
1. Go to Vercel dashboard → Your Project → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically configured

### **Netlify Custom Domain**
1. Go to Netlify dashboard → Site settings → Domain management
2. Add custom domain
3. Update DNS records
4. SSL is automatically configured

## 🔧 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connected and migrated
- [ ] Email service working
- [ ] Build successful locally (`npm run build`)
- [ ] Test all contact form functionality
- [ ] Check responsive design
- [ ] Verify authentication flow
- [ ] Test admin dashboard

## 📊 Analytics Setup (Optional)

### **Google Analytics**
```bash
# Add to .env.production
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### **Vercel Analytics**
1. Enable in Vercel dashboard
2. No configuration needed

## 🚨 Important Notes

1. **Never commit `.env` files** to version control
2. **Use strong secrets** for production
3. **Test email functionality** before going live
4. **Set up monitoring** for uptime and errors
5. **Regular backups** of your database

## 🔄 Continuous Deployment

### **GitHub Actions (Optional)**
Create `.github/workflows/deploy.yml` for automatic deployments:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🆘 Troubleshooting

### **Common Issues**
1. **Build fails**: Check environment variables and dependencies
2. **Database connection**: Verify DATABASE_URL format
3. **Email not working**: Check SMTP credentials and ports
4. **Auth errors**: Ensure NEXTAUTH_URL matches your domain

### **Get Help**
- Check deployment logs
- Verify environment variables
- Test locally with production settings
- Contact hosting provider support

---

**🎉 Your portfolio is ready for production!**