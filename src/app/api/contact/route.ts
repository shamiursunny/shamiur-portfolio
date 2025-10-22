import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { sendContactNotification, sendAutoReply } from "@/lib/email"
import { messageStorage } from "@/lib/message-storage"

// Input validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters")
})

// Rate limiting (simple in-memory implementation)
const rateLimit = new Map<string, { count: number; lastRequest: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return ip
}

function isRateLimited(clientId: string): boolean {
  const now = Date.now()
  const clientData = rateLimit.get(clientId)

  if (!clientData) {
    rateLimit.set(clientId, { count: 1, lastRequest: now })
    return false
  }

  if (now - clientData.lastRequest > RATE_LIMIT_WINDOW) {
    rateLimit.set(clientId, { count: 1, lastRequest: now })
    return false
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  clientData.count++
  clientData.lastRequest = now
  return false
}

// Security: Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    if (isRateLimited(clientId)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate input
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { name, email, message } = validationResult.data

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message)
    }

    // Save to database
    try {
      await db.contact.create({
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          message: sanitizedData.message,
          createdAt: new Date()
        }
      })

      // Also add to message storage for real-time dashboard updates
      messageStorage.addMessage({
        name: sanitizedData.name,
        email: sanitizedData.email,
        message: sanitizedData.message
      })

      // Log the contact submission (in development only)
      if (process.env.NODE_ENV === 'development') {
        console.log(`New contact submission from ${sanitizedData.email}: ${sanitizedData.name}`)
      }

      // Send email notification to admin
      const notificationResult = await sendContactNotification({
        name: sanitizedData.name,
        email: sanitizedData.email,
        message: sanitizedData.message,
        createdAt: new Date()
      })

      if (!notificationResult.success) {
        console.warn('Failed to send email notification:', notificationResult.error)
        // Don't fail the request, but log the error
      }

      // Send auto-reply to the person who contacted (optional)
      const autoReplyResult = await sendAutoReply({
        name: sanitizedData.name,
        email: sanitizedData.email,
        message: sanitizedData.message,
        createdAt: new Date()
      })

      if (!autoReplyResult.success) {
        console.warn('Failed to send auto-reply:', autoReplyResult.error)
        // Don't fail the request, but log the error
      }

      // Emit Socket.IO event for real-time notification (if socket server is running)
      try {
        // This would be handled by your Socket.IO server
        // You can emit an event here if needed
      } catch (socketError) {
        // Don't fail the request if socket notification fails
        console.warn('Socket notification failed:', socketError)
      }

      return NextResponse.json(
        { success: true, message: "Contact form submitted successfully" },
        { status: 200 }
      )

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: "Failed to save contact information" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  )
}