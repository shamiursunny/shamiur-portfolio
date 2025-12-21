
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Octokit } from "octokit"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export const maxDuration = 300; // 5 minutes for full build

export async function POST(request: NextRequest) {
    try {
        // Note: This can be called by the Chat API (internal) or Admin (manual)
        // For now, we'll allow internal calls or authenticated admin calls
        const body = await request.json()
        const { projectName, description, techStack, features, clientEmail } = body

        if (!projectName || !clientEmail) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 1. Fetch Credentials from Settings
        const settings = await db.setting.findMany({
            where: {
                key: { in: ['GITHUB_TOKEN', 'OPENAI_API_KEY'] }
            }
        })

        const config: Record<string, string> = {}
        settings.forEach(s => config[s.key] = s.value)

        const githubToken = config['GITHUB_TOKEN'] || process.env.GITHUB_TOKEN
        const openaiKey = config['OPENAI_API_KEY'] || process.env.OPENAI_API_KEY

        if (!githubToken || !openaiKey) {
            return NextResponse.json({ error: "API Keys not configured in Settings" }, { status: 500 })
        }

        // 2. Generate Codebase
        console.log(`Generating code for ${projectName}...`)
        const { text: codebase } = await generateText({
            model: openai('gpt-4o', { apiKey: openaiKey }),
            system: `You are a Senior Fullstack Developer. 
      Generate a complete, single-file prototype (e.g., a React component or a Node.js script) based on the requirements.
      CRITICAL: You MUST add a comment on EVERY SINGLE LINE of code explaining what it does.
      Include a header with:
      // Copyright (c) 2025 Shamiur Rashid Sunny. All rights reserved.
      // Owner: Shamiur Rashid Sunny (https://shamiur.com)
      `,
            prompt: `Project: ${projectName}\nDescription: ${description}\nTech Stack: ${techStack}\nFeatures: ${features.join(', ')}`,
        })

        // 3. Create GitHub Repository
        console.log(`Creating GitHub repo for ${projectName}...`)
        const octokit = new Octokit({ auth: githubToken })
        const repoName = projectName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4)

        const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            description: description,
            auto_init: true,
        })

        // 4. Push Code (Create file in repo)
        console.log(`Pushing code to ${repoName}...`)
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: repo.owner.login,
            repo: repoName,
            path: 'README.md',
            message: 'Initial commit: Project Overview',
            content: Buffer.from(`# ${projectName}\n\n${description}\n\n## Tech Stack\n${techStack}\n\n## Features\n${features.map(f => `- ${f}`).join('\n')}\n\n---\nCopyright (c) 2025 Shamiur Rashid Sunny. All rights reserved.`).toString('base64'),
        })

        await octokit.rest.repos.createOrUpdateFileContents({
            owner: repo.owner.login,
            repo: repoName,
            path: 'app.js', // Simplified for prototype
            message: 'Add prototype implementation',
            content: Buffer.from(codebase).toString('base64'),
        })

        // 5. Send Email to Client
        console.log(`Sending email to ${clientEmail}...`)
        try {
            const { sendContactNotification } = await import('@/lib/email')
            await sendContactNotification({
                name: 'AI Agent',
                email: clientEmail,
                message: `Hello,\n\nYour project prototype for "${projectName}" has been generated.\n\nGitHub Repository: ${repo.html_url}\n\nThis project was built autonomously by Shamiur Rashid Sunny's AI Agency.\n\nBest regards,\nAI Agent`,
                createdAt: new Date()
            })
        } catch (emailError) {
            console.error('Failed to send email via Resend:', emailError)
            // Continue even if email fails, as the repo is created
        }

        // 6. Register Project in Dashboard
        await db.project.create({
            data: {
                title: projectName,
                description: description,
                link: repo.html_url,
                category: 'AI_PROTOTYPE',
                tech: techStack,
            }
        })

        // 7. Log Success
        await db.aiLog.create({
            data: {
                action: 'CREATE_PROTOTYPE',
                details: `Successfully built ${projectName}. Repo: ${repo.html_url}`,
                status: 'SUCCESS'
            }
        })

        return NextResponse.json({
            success: true,
            repoUrl: repo.html_url,
            message: "Prototype built and client notified."
        })

    } catch (error: any) {
        console.error("Error in prototype builder:", error)
        await db.aiLog.create({
            data: {
                action: 'CREATE_PROTOTYPE',
                details: `Error: ${error.message}`,
                status: 'FAILED'
            }
        })
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
    }
}
