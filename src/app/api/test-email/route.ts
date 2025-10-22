import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sendContactNotification } from "@/lib/email"

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
    const { to, subject, message } = body

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, message" },
        { status: 400 }
      )
    }

    // Send test email
    const result = await sendContactNotification({
      name: "Test User",
      email: to,
      message: message,
      createdAt: new Date()
    })

    if (result.success) {
      return NextResponse.json(
        { success: true, message: "Test email sent successfully", messageId: result.messageId },
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