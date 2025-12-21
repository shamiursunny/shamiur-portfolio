
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

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

        const section = await db.section.update({
            where: { id },
            data: body
        })

        return NextResponse.json(section)
    } catch (error) {
        console.error("Error updating section:", error)
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

        await db.section.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting section:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
