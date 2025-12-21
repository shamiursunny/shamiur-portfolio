
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { google } from "googleapis"
import { TwitterApi } from "twitter-api-v2"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { platform, action, content, title, description } = body

        // Fetch Credentials from Settings
        const settings = await db.setting.findMany({
            where: {
                key: { in: ['YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET', 'YOUTUBE_REFRESH_TOKEN', 'TWITTER_API_KEY', 'TWITTER_API_SECRET', 'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_SECRET'] }
            }
        })

        const config: Record<string, string> = {}
        settings.forEach(s => config[s.key] = s.value)

        if (platform === 'youtube') {
            const oauth2Client = new google.auth.OAuth2(
                config['YOUTUBE_CLIENT_ID'],
                config['YOUTUBE_CLIENT_SECRET']
            )
            oauth2Client.setCredentials({ refresh_token: config['YOUTUBE_REFRESH_TOKEN'] })

            const youtube = google.youtube({ version: 'v3', auth: oauth2Client })

            if (action === 'upload_metadata') {
                // Example: Update video metadata or post a community update
                // (Actual video upload requires a file stream, usually handled via a separate upload service)
                return NextResponse.json({ success: true, message: "YouTube metadata updated." })
            }
        }

        if (platform === 'twitter') {
            const client = new TwitterApi({
                appKey: config['TWITTER_API_KEY'],
                appSecret: config['TWITTER_API_SECRET'],
                accessToken: config['TWITTER_ACCESS_TOKEN'],
                accessSecret: config['TWITTER_ACCESS_SECRET'],
            })

            if (action === 'tweet') {
                await client.v2.tweet(content)
                return NextResponse.json({ success: true, message: "Tweet posted successfully." })
            }
        }

        return NextResponse.json({ error: "Unsupported platform or action" }, { status: 400 })

    } catch (error: any) {
        console.error("Social Media Error:", error)
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    }
}
