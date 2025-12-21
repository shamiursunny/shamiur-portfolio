
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const pageSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    isPublished: z.boolean().optional().default(true)
})

export async function GET(request: NextRequest) {
    try {
        const pages = await db.page.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { sections: true }
        })
        return NextResponse.json(pages)
    } catch (error) {
        console.error("Error fetching pages:", error)
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
        const validation = pageSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input", details: validation.error.issues }, { status: 400 })
        }

        const { title, slug, description, isPublished } = validation.data

        // Check if slug exists
        const existingPage = await db.page.findUnique({ where: { slug } })
        if (existingPage) {
            return NextResponse.json({ error: "Page with this slug already exists" }, { status: 409 })
        }

        const page = await db.page.create({
            data: {
                title,
                slug,
                description,
                isPublished
            }
        })

        return NextResponse.json(page)
    } catch (error) {
        console.error("Error creating page:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
