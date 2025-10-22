# 🚀 Portfolio Dashboard Setup Guide

## 📧 **Email Authentication Setup**

Your portfolio website is now configured with email authentication for dashboard access. Here's how to get started:

### **1. Your Credentials**
- **Email:** `shamiur@engineer.com`
- **Password:** `Shahid@221286`

### **2. Access Your Dashboard**

#### **Step 1: Go to Sign-in Page**
```
http://localhost:3000/auth/signin
```

#### **Step 2: Enter Your Email**
- Enter: `shamiur@engineer.com`
- Click "Send Sign-in Link"

#### **Step 3: Check Your Email**
- You'll receive a sign-in link at `shamiur@engineer.com`
- Click the link in the email to access your dashboard

#### **Step 4: Access Dashboard**
- You'll be automatically redirected to: `http://localhost:3000/dashboard`

## 📊 **Dashboard Features**

### **View Contact Messages**
- All "Get In Touch" form submissions
- Sender name, email, message, and timestamp
- Real-time updates when new messages arrive

### **Manage Projects**
- Add new projects
- Edit existing projects
- Delete projects
- View project statistics

### **Statistics**
- Total contacts count
- Total projects count
- New contacts this month
- Contact analytics with charts

## 🔧 **How Contact Messages Work**

### **1. Form Submission Process**
1. User fills out the "Get In Touch" form on `/contact`
2. Form is validated and sanitized
3. Message is saved to the database
4. You receive real-time notification in dashboard

### **2. Security Features**
- ✅ Input validation with Zod
- ✅ XSS protection
- ✅ Rate limiting (5 messages per minute per IP)
- ✅ Email format validation
- ✅ Content sanitization

### **3. Data Storage**
- Messages stored in SQLite database
- Each message includes: name, email, message, timestamp
- Secure and persistent storage

## 📱 **Alternative Access Methods**

### **1. Direct Database Access**
```sql
-- View all messages
SELECT id, name, email, message, createdAt FROM Contact;

-- View recent messages
SELECT * FROM Contact ORDER BY createdAt DESC LIMIT 10;
```

### **2. Development Logs**
In development mode, new submissions are logged:
```
New contact submission from email@example.com: John Doe
```

### **3. API Access**
```bash
# Get all contacts (requires authentication)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/contacts

# Get all projects
curl http://localhost:3000/api/projects
```

## 🛠️ **Troubleshooting**

### **Email Not Received?**
1. Check spam/junk folder
2. Verify email configuration in `.env`
3. Ensure SMTP server is accessible

### **Dashboard Access Issues?**
1. Make sure you're logged in
2. Check browser console for errors
3. Verify session is valid

### **Contact Messages Not Showing?**
1. Check database connection
2. Verify API endpoints are working
3. Check browser network tab for errors

## 🔐 **Security Notes**

### **Environment Variables**
- All sensitive data stored in `.env`
- Never commit `.env` to version control
- Use strong, unique passwords

### **Authentication**
- Email-based authentication (no passwords stored)
- Secure session management
- Automatic session expiration

### **Rate Limiting**
- 5 messages per minute per IP
- Prevents spam and abuse
- Configurable limits

## 📈 **Next Steps**

### **Optional Enhancements**
1. **Email Notifications:** Get email alerts for new messages
2. **Export Features:** Download contacts as CSV/Excel
3. **Advanced Analytics:** Google Analytics integration
4. **SMS Notifications:** SMS alerts for urgent messages
5. **Auto-responder:** Automatic email replies

### **Production Deployment**
1. Update `NEXTAUTH_URL` to your domain
2. Use production email service (SendGrid, AWS SES)
3. Set up SSL certificate
4. Configure backup strategy

## 🆘 **Support**

If you encounter any issues:
1. Check the development logs: `tail -f dev.log`
2. Verify environment variables
3. Test email configuration
4. Check database connectivity

---

**🎉 Your portfolio dashboard is now ready!** 

Access it at: `http://localhost:3000/auth/signin`