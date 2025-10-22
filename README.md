# Secure Portfolio Website

A modern, secure personal portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Features project showcase, contact form, and admin dashboard with authentication.

## 🚀 Features

- **🏠 Beautiful Home Page** - Hero section with animations, about section, featured projects
- **📁 Projects Showcase** - Dynamic project gallery with filtering and search
- **📧 Contact Form** - Secure contact form with validation and rate limiting
- **👨‍💼 Admin Dashboard** - Protected admin panel for managing contacts and projects
- **🔒 Security Features** - Input validation, XSS protection, rate limiting
- **📱 Responsive Design** - Mobile-first design that works on all devices
- **✨ Animations** - Smooth Framer Motion animations
- **🔐 Authentication** - Passwordless email authentication with NextAuth.js

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Prisma ORM with SQLite
- **Authentication**: NextAuth.js (Email provider)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Email Configuration
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📧 Email Setup

### For Development

Option 1: **Use Ethereal (Recommended for testing)**
1. Go to [Ethereal](https://ethereal.email/)
2. Create an account
3. Use the provided SMTP settings in your `.env`

Option 2: **Use Mailtrap**
1. Create a [Mailtrap](https://mailtrap.io/) account
2. Use the SMTP settings from your inbox

### For Production

Option 1: **Gmail with App Password**
1. Enable 2-factor authentication on your Gmail
2. Generate an App Password
3. Use your email and App Password in `.env`

Option 2: **SendGrid**
1. Create a SendGrid account
2. Generate an API key
3. Use SendGrid SMTP settings

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── projects/page.tsx     # Projects showcase
│   ├── contact/page.tsx      # Contact form
│   ├── dashboard/page.tsx    # Admin dashboard
│   ├── auth/
│   │   ├── signin/page.tsx   # Sign in page
│   │   ├── verify-request/page.tsx # Email verification
│   │   └── error/page.tsx    # Auth error page
│   └── api/
│       ├── auth/[...nextauth]/route.ts # NextAuth API
│       ├── contact/route.ts  # Contact API
│       └── projects/route.ts # Projects API
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── navbar.tsx           # Navigation
│   ├── footer.tsx           # Footer
│   └── session-provider.tsx # Auth provider
└── lib/
    ├── auth.ts              # NextAuth config
    ├── db.ts                # Database client
    └── utils.ts             # Utility functions
```

## 🔐 Security Features

- **Input Validation**: All user inputs validated with Zod schemas
- **XSS Protection**: Inputs sanitized to prevent XSS attacks
- **Rate Limiting**: Contact form submissions rate limited
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Secure Headers**: Security headers configured via Next.js
- **Passwordless Auth**: No password storage, reduces attack surface

## 📱 Pages

### Public Pages
- **Home** (`/`) - Landing page with hero section and featured projects
- **Projects** (`/projects`) - Project showcase with filtering and search
- **Contact** (`/contact`) - Contact form with validation

### Authentication Pages
- **Sign In** (`/auth/signin`) - Email-based sign in
- **Verify Request** (`/auth/verify-request`) - Email sent confirmation
- **Auth Error** (`/auth/error`) - Authentication error handling

### Protected Pages
- **Dashboard** (`/dashboard`) - Admin panel (requires authentication)

## 🎨 Customization

### Personal Information
Edit the following files to customize your portfolio:

1. **Home Page** (`src/app/page.tsx`):
   - Name and title
   - About section content
   - Skills and technologies

2. **Projects** (`src/app/projects/page.tsx`):
   - Sample project data
   - Categories and filters

3. **Contact** (`src/app/contact/page.tsx`):
   - Contact information
   - Social media links

4. **Footer** (`src/components/footer.tsx`):
   - Social media profiles
   - Contact details

### Styling
- **Colors**: Edit `tailwind.config.ts` for theme colors
- **Fonts**: Modify font imports in `layout.tsx`
- **Components**: Customize shadcn/ui components in `src/components/ui/`

## 📊 Database Schema

The application uses the following main models:

- **User**: Authentication and user management
- **Project**: Portfolio projects with metadata
- **Contact**: Contact form submissions
- **Account/Session**: NextAuth.js authentication tables

## 🚀 Deployment

### Environment Variables
Ensure these are set in production:
```env
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
EMAIL_SERVER_HOST=your-production-smtp
EMAIL_SERVER_USER=your-email
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com
```

### Build and Deploy
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Search existing [GitHub issues](../../issues)
3. Create a new issue with detailed information

## 🔧 Troubleshooting

### Common Issues

**Email not sending:**
- Check SMTP credentials in `.env`
- Verify email provider settings
- Check spam folder

**Database errors:**
- Run `npm run db:push` to update schema
- Check `DATABASE_URL` is correct

**Authentication issues:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies

### Development Tips

- Use `npm run lint` to check code quality
- Run `npm run db:push` after schema changes
- Check browser console for errors
- Use React DevTools for debugging

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS