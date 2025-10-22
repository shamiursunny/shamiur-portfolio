import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const settingsSchema = z.object({
  adminEmail: z.string().email("Invalid email address"),
  enableNotifications: z.boolean(),
  enableAutoReply: z.boolean(),
  emailSubject: z.string().min(1, "Email subject is required")
})

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
    const validationResult = settingsSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const settings = validationResult.data

    // In a real application, you would save these to a database
    // For now, we'll just return success
    // TODO: Implement settings persistence
    
    console.log('Settings updated:', settings)

    return NextResponse.json(
      { success: true, message: "Settings saved successfully" },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Return current settings (in a real app, these would come from database)
    const settings = {
      adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER,
      enableNotifications: true,
      enableAutoReply: true,
      emailSubject: "🔔 New Contact Message from {name}"
    }

    return NextResponse.json(settings)

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}