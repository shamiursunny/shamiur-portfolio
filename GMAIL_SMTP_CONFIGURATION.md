# Gmail SMTP Configuration Guide

## Overview
This document explains how the email system is configured to use only Google SMTP for sending all transactional emails from your portfolio website.

## Configuration Details

### Email Provider
- **Service**: Google SMTP (Gmail)
- **Protocol**: SMTP with TLS (port 587)
- **Authentication**: App Password recommended for production
- **Sender Address**: `noreply@shamiur.com`

### Environment Variables

Required environment variables in `.env`:

```env
# --- Email Configuration (Google SMTP Only) ---
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=shamiur.sunny@gmail.com
EMAIL_SERVER_PASSWORD=Shahid@221286
EMAIL_FROM=noreply@shamiur.com
CONTACT_EMAIL_TO=shamiur.sunny@gmail.com
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_SERVER_HOST` | Gmail SMTP server address | `smtp.gmail.com` |
| `EMAIL_SERVER_PORT` | SMTP port (587 for TLS) | `587` |
| `EMAIL_SERVER_USER` | Gmail address for authentication | `your-email@gmail.com` |
| `EMAIL_SERVER_PASSWORD` | Gmail app password | `your-app-password` |
| `EMAIL_FROM` | Sender email address | `noreply@shamiur.com` |
| `CONTACT_EMAIL_TO` | Admin email for notifications | `admin@example.com` |

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Follow the setup process

### 2. Generate App Password
1. Go to Google Account settings
2. Navigate to "Security" → "2-Step Verification" → "App passwords"
3. Click "Select app" → "Other (Custom name)"
4. Enter "shamiur-portfolio" as the app name
5. Click "Generate"
6. Copy the 16-character password

### 3. Update Environment Variables
Replace the example values in `.env` with your actual credentials:

```env
EMAIL_SERVER_USER=your-actual-email@gmail.com
EMAIL_SERVER_PASSWORD=your-16-character-app-password
```

## Email Templates

### Admin Notification Template
- **Subject**: `🔔 New Contact Message from [Name] - shamiur.com`
- **Sender**: `noreply@shamiur.com`
- **Recipient**: Admin email (CONTACT_EMAIL_TO)
- **Features**: Professional design with shamiur.com branding

### Auto-Reply Template
- **Subject**: `Thank you for contacting shamiur.com`
- **Sender**: `noreply@iamur.com`
- **Recipient**: Contact form submitter
- **Features**: Professional confirmation with message copy

## Email Flow

### Contact Form Submission Process
1. User submits contact form
2. Data is saved to database
3. **Admin Notification**: Sent via Gmail SMTP to `CONTACT_EMAIL_TO`
4. **Auto-Reply**: Sent via Gmail SMTP to user's email
5. Both emails use `noreply@shamiur.com` as sender

### Email Deliverability
- **DKIM/SPF**: Handled by Gmail automatically
- **Reply-To**: Set to sender's email for admin notifications
- **Professional Branding**: All emails include shamiur.com branding

## Code Structure

### Email Service File
**Location**: `src/lib/email.ts`

**Main Functions**:
- `sendContactNotification()` - Send admin notifications
- `sendAutoReply()` - Send user confirmations
- `testEmailConfiguration()` - Test email setup

### Gmail Transporter Configuration
```typescript
const createGmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}
```

## Testing

### Manual Testing
1. Submit a message through the contact form
2. Check admin email for notification
3. Check user email for auto-reply
4. Verify sender address is `noreply@shamiur.com`

### Automated Testing
Use the test endpoint:
```javascript
POST /api/test-email
{
  "type": "full-test"
}
```

## Troubleshooting

### Common Issues

#### Gmail Authentication Failed
**Error**: "535-5-7-7 Username and Password not accepted"
**Solution**: Use App Password instead of regular password

#### Connection Refused
**Error**: "ECONNREFUSED"
**Solution**: Check EMAIL_SERVER_HOST and EMAIL_SERVER_PORT

#### Invalid Credentials
**Error**: "535-5-7-8 Username and Password not accepted"
**Solution**: Verify app password and email address

### Debug Mode
Enable debug logging in development:
```typescript
const transporter = nodemailer.createTransporter({
  // ... other config
  debug: true, // Enable debug logging
  logger: true  // Log to console
})
```

## Security Considerations

### App Password Security
- ✅ Use app passwords instead of regular passwords
- ✅ Store app passwords in environment variables only
- ✅ Never commit app passwords to version control
- ✅ Rotate app passwords regularly

### Email Security
- ✅ Input validation and sanitization
- ✅ Rate limiting on contact form
- ✅ Professional email templates with proper headers
- ✅ No sensitive data in email content

## Deployment Notes

### Vercel Configuration
The `vercel.json` file includes:
- `EMAIL_FROM` environment variable
- Proper CORS headers for API endpoints
- Optimized build configuration

### Environment Variables
Ensure these are set in your Vercel dashboard:
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`
- `CONTACT_EMAIL_TO`

## Migration from Resend

### Changes Made
- ✅ Removed `resend` package dependency
- ✅ Removed `RESEND_API_KEY` environment variable
- ✅ Simplified email service to use only Gmail SMTP
- ✅ Updated all email templates to maintain consistency
- ✅ Removed fallback logic (no longer needed)

### Benefits
- ✅ Simpler configuration
- ✅ No external dependencies
- ✅ Reliable Gmail deliverability
- ✅ Professional email appearance
- ✅ Cost-effective (no additional service fees)

---

**Last Updated**: November 1, 2024  
**Email Provider**: Google SMTP  
**Status**: ✅ Active and Configured