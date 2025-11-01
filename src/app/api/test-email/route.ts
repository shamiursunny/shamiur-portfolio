import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sendContactNotification, sendAutoReply, testEmailConfiguration } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, to, subject, message } = body

    // Test full email configuration
    if (type === 'full-test') {
      const results = await testEmailConfiguration()
      return NextResponse.json(
        { success: true, results },
        { status: 200 }
      )
    }

    // Test individual email
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, message" },
        { status: 400 }
      )
    }

    const testData = {
      name: "Test User",
      email: to,
      message: message,
      createdAt: new Date()
    }

    let result
    if (type === 'admin-notification') {
      result = await sendContactNotification(testData)
    } else if (type === 'auto-reply') {
      result = await sendAutoReply(testData)
    } else {
      // Default: send admin notification
      result = await sendContactNotification(testData)
    }

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: "Test email sent successfully", 
          messageId: result.messageId,
          provider: result.provider 
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send test email" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    )
  }
}