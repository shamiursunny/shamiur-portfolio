
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function DELETE(
    request: NextRequest,
    { params }: { params: { key: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { key } = params

        await db.setting.delete({
            where: { key }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting setting:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
