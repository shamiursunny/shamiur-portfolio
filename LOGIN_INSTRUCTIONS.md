# Secure Portfolio - Login Instructions

## 🔐 Admin Access

### Default Admin Account
- **Email**: `admin@sunny.dev`
- **Password**: `admin123`

### Login Steps
1. Navigate to `/auth/signin` or click "Login" in the navigation
2. Enter the admin credentials above
3. You'll be redirected to the dashboard at `/dashboard`

### Features
- **Dashboard**: View contacts and manage projects
- **Contact Management**: View and delete contact form submissions
- **Project Management**: Add, view, and delete projects
- **Real-time Updates**: Socket.IO integration for live notifications

### Security Notes
- Change the default password after first login
- Authentication is protected by NextAuth.js
- All API routes require authentication
- Passwords are hashed using bcryptjs

### Database Setup
If you need to reset the database:
```bash
npm run db:reset
npm run db:seed
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:3000`