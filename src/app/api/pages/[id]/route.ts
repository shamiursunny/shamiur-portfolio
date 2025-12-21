
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const page = await db.page.findUnique({
            where: { id: params.id },
            include: { sections: { orderBy: { order: 'asc' } } }
        })

        if (!page) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 })
        }

        return NextResponse.json(page)
    } catch (error) {
        console.error("Error fetching page:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { id } = params

        const page = await db.page.update({
            where: { id },
            data: body
        })

        return NextResponse.json(page)
    } catch (error) {
        console.error("Error updating page:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = params

        await db.page.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting page:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
