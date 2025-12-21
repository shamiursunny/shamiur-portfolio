
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { pluginName, action, data } = body

        if (!pluginName || !action) {
            return NextResponse.json({ error: "Missing plugin name or action" }, { status: 400 })
        }

        // Fetch Webhook URL from Settings
        const settingKey = `${pluginName.toUpperCase()}_WEBHOOK_URL`
        const setting = await db.setting.findUnique({
            where: { key: settingKey }
        })

        const webhookUrl = setting?.value

        if (!webhookUrl) {
            return NextResponse.json({ error: `Webhook URL for ${pluginName} not configured` }, { status: 500 })
        }

        console.log(`Triggering ${pluginName} webhook: ${action}`)

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action,
                data,
                timestamp: new Date().toISOString(),
                owner: "Shamiur Rashid Sunny"
            })
        })

        if (!response.ok) {
            throw new Error(`External plugin responded with status: ${response.status}`)
        }

        // Log the automation action
        await db.aiLog.create({
            data: {
                action: `PLUGIN_${pluginName.toUpperCase()}`,
                details: `Action: ${action}, Data: ${JSON.stringify(data)}`,
                status: 'SUCCESS'
            }
        })

        return NextResponse.json({ success: true, message: `${pluginName} automation triggered.` })

    } catch (error: any) {
        console.error("Automation Plugin Error:", error)
        await db.aiLog.create({
            data: {
                action: 'PLUGIN_ERROR',
                details: error.message,
                status: 'FAILED'
            }
        })
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    }
}
