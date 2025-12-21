
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  category: z.string().optional().default("SYSTEM")
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await db.setting.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Mask sensitive values in response if needed, but for admin dashboard we might want to see them or partial view
    // For now, returning full values as it's admin only
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = settingSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.issues }, { status: 400 })
    }

    const { key, value, category } = validation.data

    const setting = await db.setting.upsert({
      where: { key },
      update: { value, category },
      create: { key, value, category }
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error saving setting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}