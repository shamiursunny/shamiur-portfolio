import nodemailer from 'nodemailer'

interface EmailNotificationData {
  name: string
  email: string
  message: string
  createdAt: Date
}

// Create Gmail transporter
const createGmailTransporter = () => {
  if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    throw new Error('Gmail SMTP credentials not configured')
  }
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

// Format date for email templates
const formatDate = (date: Date) => {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  })
}

// Admin notification email template
const getAdminNotificationTemplate = (contactData: EmailNotificationData) => {
  const formattedDate = formatDate(contactData.createdAt)
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message - shamiur.com</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .contact-info {
            background: #f1f5f9;
            border-left: 4px solid #2563eb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .contact-info h3 {
            margin: 0 0 15px 0;
            color: #1e40af;
            font-size: 18px;
        }
        .contact-info p {
            margin: 8px 0;
            font-size: 14px;
        }
        .contact-info strong {
            color: #374151;
        }
        .message-box {
            background: white;
            border: 1px solid #e5e7eb;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            font-style: italic;
            position: relative;
        }
        .message-box:before {
            content: '"';
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 48px;
            color: #e5e7eb;
            font-family: Georgia, serif;
        }
        .message-box p {
            margin: 0;
            padding-left: 20px;
            color: #4b5563;
            line-height: 1.7;
        }
        .btn {
            display: inline-block;
            padding: 14px 28px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            margin: 20px 0;
            transition: background-color 0.2s;
        }
        .btn:hover {
            background: #1d4ed8;
        }
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
            font-size: 13px;
            color: #6b7280;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
        .brand {
            font-weight: 600;
            color: #1e40af;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            .header, .content, .footer {
                padding: 25px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 New Contact Message</h1>
            <p>You received a new message from <span class="brand">shamiur.com</span></p>
        </div>
        
        <div class="content">
            <div class="contact-info">
                <h3>📧 Contact Information</h3>
                <p><strong>Name:</strong> ${contactData.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${contactData.email}" style="color: #2563eb;">${contactData.email}</a></p>
                <p><strong>Date:</strong> ${formattedDate}</p>
            </div>
            
            <div class="message-box">
                <p>${contactData.message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="text-align: center;">
                <a href="https://shamiur.com/dashboard" class="btn">View in Dashboard</a>
            </div>
        </div>
        
        <div class="footer">
            <p>This message was sent from the contact form at <a href="https://shamiur.com">shamiur.com</a></p>
            <p>© 2024 Shamiur Rashid Sunny. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
}

// Auto-reply email template
const getAutoReplyTemplate = (contactData: EmailNotificationData) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting shamiur.com</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #374151;
            margin-bottom: 20px;
        }
        .message-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 4px solid #10b981;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .message-box p {
            margin: 0;
            color: #4b5563;
            line-height: 1.7;
        }
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .signature p {
            margin: 5px 0;
            color: #374151;
        }
        .signature strong {
            color: #1f2937;
        }
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
            font-size: 13px;
            color: #6b7280;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
        .brand {
            font-weight: 600;
            color: #059669;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            .header, .content, .footer {
                padding: 25px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Thank You for Contacting Me!</h1>
            <p>Your message has been received at <span class="brand">shamiur.com</span></p>
        </div>
        
        <div class="content">
            <p class="greeting">Dear ${contactData.name},</p>
            
            <p>Thank you for reaching out to me through my portfolio website at <strong>shamiur.com</strong>. I've received your message and will get back to you as soon as possible.</p>
            
            <div class="message-box">
                <p>Here's a copy of your message for your records:</p>
                <br>
                <p><em>${contactData.message.replace(/\n/g, '<br>')}</em></p>
            </div>
            
            <p>I typically respond within 24-48 hours. If your matter is urgent, please mention it in your message, and I'll prioritize it accordingly.</p>
            
            <div class="signature">
                <p>Best regards,</p>
                <p><strong>Shamiur Rashid Sunny</strong></p>
                <p>Full Stack Developer & DevSecOps Engineer</p>
                <p><a href="https://shamiur.com" style="color: #2563eb;">shamiur.com</a></p>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated response from <a href="https://shamiur.com">shamiur.com</a></p>
            <p>Please do not reply to this email. For further communication, I'll respond from my personal email.</p>
            <p>© 2024 Shamiur Rashid Sunny. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
}

// Send email using Gmail SMTP
const sendWithGmail = async (to: string, subject: string, html: string, replyTo?: string) => {
  try {
    const transporter = createGmailTransporter()
    
    const mailOptions = {
      from: `"Shamiur Rashid Sunny" <${process.env.EMAIL_FROM}>`, // Professional sender with noreply@shamiur.com
      to: to,
      subject: subject,
      html: html,
      replyTo: replyTo || undefined
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent via Gmail SMTP:', info.messageId)
    return { success: true, messageId: info.messageId, provider: 'gmail-smtp' }
  } catch (error) {
    console.error('Gmail SMTP sending failed:', error)
    throw error
  }
}

// Send notification to admin
export async function sendContactNotification(contactData: EmailNotificationData) {
  try {
    const adminEmail = process.env.CONTACT_EMAIL_TO || process.env.EMAIL_SERVER_USER
    if (!adminEmail) {
      throw new Error('Admin email not configured')
    }

    const subject = `🔔 New Contact Message from ${contactData.name} - shamiur.com`
    const html = getAdminNotificationTemplate(contactData)

    const result = await sendWithGmail(
      adminEmail,
      subject,
      html,
      contactData.email // Allow direct reply to the sender
    )

    if (result.success) {
      console.log(`Admin notification sent via Gmail SMTP:`, result.messageId)
      return { success: true, messageId: result.messageId, provider: result.provider }
    } else {
      throw new Error('Failed to send admin notification')
    }

  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error: (error as Error).message }
  }
}

// Send auto-reply to the person who contacted
export async function sendAutoReply(contactData: EmailNotificationData) {
  try {
    const subject = `Thank you for contacting shamiur.com`
    const html = getAutoReplyTemplate(contactData)

    const result = await sendWithGmail(
      contactData.email,
      subject,
      html
    )

    if (result.success) {
      console.log(`Auto-reply sent via Gmail SMTP:`, result.messageId)
      return { success: true, messageId: result.messageId, provider: result.provider }
    } else {
      throw new Error('Failed to send auto-reply')
    }

  } catch (error) {
    console.error('Error sending auto-reply:', error)
    return { success: false, error: (error as Error).message }
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  const testData: EmailNotificationData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message to verify Gmail SMTP configuration.',
    createdAt: new Date()
  }

  const adminResult = await sendContactNotification(testData)
  const autoReplyResult = await sendAutoReply(testData)

  return {
    admin: adminResult,
    autoReply: autoReplyResult
  }
}