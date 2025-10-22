# 📧 Demo Message Testing Guide

This guide will help you test the email notification system using the demo messages I've created.

## 🚀 Quick Start

### Option 1: Single Demo Message (Recommended for testing)

1. **Navigate to Contact Form**
   ```
   http://localhost:3000/contact
   ```

2. **Click "Fill Demo Data" Button**
   - This will randomly populate the form with one of 5 realistic demo messages
   - Messages include job inquiries, project proposals, and collaboration requests

3. **Click "Send Message"**
   - This will send the message and trigger:
     - ✅ Email notification to `shamiur@engineer.com`
     - ✅ Auto-reply to the sender
     - ✅ Database storage
     - ✅ Real-time dashboard update

### Option 2: Automated Demo Testing (Advanced)

1. **Navigate to Dashboard Settings**
   ```
   http://localhost:3000/dashboard/settings
   ```

2. **Go to "Security" Tab**

3. **Use the Demo Tester**
   - Click "Start Demo" to send all 5 demo messages automatically
   - Each message is sent 2 seconds apart (to avoid rate limiting)
   - Watch real-time results and success/failure status

## 📨 Demo Message Templates

The system includes 5 realistic demo messages:

### 1. Sarah Johnson - Tech Startup
- **From**: sarah.johnson@techcorp.com
- **Content**: Fintech startup looking for DevSecOps developer
- **Type**: Job opportunity

### 2. Michael Chen - Digital Agency
- **From**: michael.chen@digitalagency.io
- **Content**: B2B e-commerce platform project
- **Type**: Project inquiry

### 3. Emily Rodriguez - Workshop Organizer
- **From**: emily.rodriguez@innovate-labs.com
- **Content**: DevSecOps workshop speaking invitation
- **Type**: Collaboration request

### 4. David Kim - StartupHub
- **From**: david.kim@startuphub.com
- **Content**: Healthcare SaaS security consulting
- **Type**: Consulting opportunity

### 5. Amanda Foster - Enterprise Tech
- **From**: amanda.foster@enterprise-tech.com
- **Content**: Multiple senior positions available
- **Type**: Recruitment

## 🔍 What Gets Tested

### Email Notifications
- ✅ Admin notification (HTML formatted)
- ✅ Auto-reply to sender
- ✅ Subject line formatting
- ✅ Reply-to functionality

### System Features
- ✅ Form validation
- ✅ Rate limiting (5 messages/minute/IP)
- ✅ Input sanitization (XSS protection)
- ✅ Database storage
- ✅ Real-time dashboard updates
- ✅ Error handling

### Security Features
- ✅ Input validation with Zod
- ✅ XSS protection
- ✅ Rate limiting
- ✅ Error message sanitization

## 📧 Email Configuration

The system is configured to use:
- **SMTP**: Gmail
- **Admin Email**: shamiur@engineer.com
- **From Email**: shamiur@engineer.com
- **Port**: 587 (TLS)

## 🛠️ Troubleshooting

### If emails don't arrive:

1. **Check Spam Folder**
   - Look in Gmail spam/promotions folders

2. **Verify Email Configuration**
   - Check `.env` file for correct Gmail credentials
   - Ensure Gmail App Password is used (not regular password)

3. **Check Server Logs**
   ```bash
   tail -f dev.log
   ```

4. **Test Email Settings**
   - Go to Dashboard → Settings → Email tab
   - Click "Send Test Email"

### If form submission fails:

1. **Check Network Tab**
   - Open browser dev tools
   - Look for 400/500 errors

2. **Check Rate Limiting**
   - Wait 1 minute between multiple submissions
   - Each IP limited to 5 messages per minute

3. **Verify Form Validation**
   - All fields must be filled
   - Email must be valid format
   - Message must be at least 10 characters

## 📊 Expected Results

### Successful Test Should Show:
1. ✅ Success toast notification
2. ✅ "Message Sent!" confirmation page
3. ✅ Email in admin inbox (within 1-2 minutes)
4. ✅ Auto-reply in demo email inbox
5. ✅ New contact in dashboard (real-time update)

### Email Content Preview:
- **Admin Email**: Professional HTML notification with contact details
- **Auto-Reply**: Thank you message with message copy
- **Dashboard**: Real-time contact list update

## 🎯 Testing Checklist

- [ ] Single demo message works
- [ ] Email notification received
- [ ] Auto-reply sent
- [ ] Dashboard updates in real-time
- [ ] Form validation works
- [ ] Rate limiting respected
- [ ] Multiple demo messages work
- [ ] Error handling works

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Review the server logs (`dev.log`)
3. Verify email configuration in `.env`
4. Test email settings in dashboard

The demo system is designed to give you a comprehensive test of all email notification features!