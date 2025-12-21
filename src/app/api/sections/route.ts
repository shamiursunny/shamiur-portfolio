
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const sectionSchema = z.object({
    pageId: z.string().min(1),
    type: z.string().min(1),
    content: z.any(),
    order: z.number().optional().default(0)
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const validation = sectionSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input", details: validation.error.issues }, { status: 400 })
        }

        const { pageId, type, content, order } = validation.data

        const section = await db.section.create({
            data: {
                pageId,
                type,
                content,
                order
            }
        })

        return NextResponse.json(section)
    } catch (error) {
        console.error("Error creating section:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
