
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { chromium } from "playwright"

export const maxDuration = 300; // 5 minutes for scanning

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { platform, keywords } = body

        if (!platform || !keywords) {
            return NextResponse.json({ error: "Missing platform or keywords" }, { status: 400 })
        }

        console.log(`Scanning ${platform} for: ${keywords}`)

        const browser = await chromium.launch({ headless: true })
        const page = await browser.newPage()

        let projects: any[] = []

        if (platform === 'freelancer') {
            await page.goto(`https://www.freelancer.com/jobs/?keyword=${encodeURIComponent(keywords)}`)
            // Basic scraping logic (selectors may need adjustment based on site changes)
            projects = await page.$$eval('.JobSearchCard-primary', cards => {
                return cards.slice(0, 5).map(card => ({
                    title: card.querySelector('.JobSearchCard-primary-heading-link')?.textContent?.trim(),
                    description: card.querySelector('.JobSearchCard-primary-description')?.textContent?.trim(),
                    price: card.querySelector('.JobSearchCard-primary-price')?.textContent?.trim(),
                    link: (card.querySelector('.JobSearchCard-primary-heading-link') as HTMLAnchorElement)?.href,
                }))
            })
        }

        await browser.close()

        // Log the scan
        await db.aiLog.create({
            data: {
                action: 'SCAN_PROJECTS',
                details: `Platform: ${platform}, Keywords: ${keywords}, Found: ${projects.length}`,
                status: 'SUCCESS'
            }
        })

        return NextResponse.json({ success: true, projects })

    } catch (error: any) {
        console.error("Scanning Error:", error)
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    }
}
