import nodemailer from 'nodemailer'

interface EmailNotificationData {
  name: string
  email: string
  message: string
  createdAt: Date
}

export async function sendContactNotification(contactData: EmailNotificationData) {
  try {
    // Create transporter using your email configuration
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    // Format the date
    const formattedDate = contactData.createdAt.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    })

    // Email content
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .message-box {
            background: white;
            padding: 20px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
            border-radius: 5px;
        }
        .contact-info {
            background: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .btn:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔔 New Contact Message</h1>
        <p>You've received a new message from your portfolio website</p>
    </div>
    
    <div class="content">
        <div class="contact-info">
            <h3>📧 Contact Information</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
            <p><strong>Date:</strong> ${formattedDate}</p>
        </div>
        
        <div class="message-box">
            <h3>💬 Message</h3>
            <p>${contactData.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/dashboard" class="btn">View in Dashboard</a>
        </div>
        
        <div class="footer">
            <p>This message was sent from your portfolio website contact form.</p>
            <p>You can manage your settings in the dashboard.</p>
        </div>
    </div>
</body>
</html>
`

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER, // Send to admin email
      subject: `🔔 New Contact Message from ${contactData.name}`,
      html: emailContent,
      replyTo: contactData.email // Allow direct reply to the sender
    }

    const info = await transporter.sendMail(mailOptions)
    
    console.log('Email notification sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }

  } catch (error) {
    console.error('Error sending email notification:', error)
    return { success: false, error: error.message }
  }
}

// Send auto-reply to the person who contacted you
export async function sendAutoReply(contactData: EmailNotificationData) {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    const autoReplyContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting me</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Contacting Me!</h1>
        <p>Shamiur Rashid Sunny</p>
    </div>
    
    <div class="content">
        <p>Dear ${contactData.name},</p>
        
        <p>Thank you for reaching out to me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
        
        <p>Here's a copy of your message for your records:</p>
        
        <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px;">
            <p>${contactData.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p>I typically respond within 24-48 hours. If your matter is urgent, please mention it in your message.</p>
        
        <p>Best regards,<br>
        <strong>Shamiur Rashid Sunny</strong><br>
        Full Stack Developer & DevSecOps Engineer</p>
        
        <div class="footer">
            <p>This is an automated response. Please do not reply to this email.</p>
            <p>Portfolio: <a href="http://localhost:3000">http://localhost:3000</a></p>
        </div>
    </div>
</body>
</html>
`

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: contactData.email,
      subject: "Thank you for contacting me - Shamiur Rashid Sunny",
      html: autoReplyContent
    }

    const info = await transporter.sendMail(mailOptions)
    
    console.log('Auto-reply sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }

  } catch (error) {
    console.error('Error sending auto-reply:', error)
    return { success: false, error: error.message }
  }
}