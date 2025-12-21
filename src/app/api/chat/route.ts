import { createOpenAI } from '@ai-sdk/openai';
import { createHuggingFace } from '@ai-sdk/huggingface';
import { streamText, tool } from 'ai';
import { db } from '@/lib/db';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Fetch API Keys from settings
        const vercelSetting = await db.setting.findUnique({
            where: { key: 'VERCEL_AI_GATEWAY_KEY' }
        });

        const deepseekSetting = await db.setting.findUnique({
            where: { key: 'DEEPSEEK_API_KEY' }
        });

        const hfSetting = await db.setting.findUnique({
            where: { key: 'HUGGINGFACE_API_KEY' }
        });

        const vercelApiKey = vercelSetting?.value || process.env.VERCEL_AI_GATEWAY_KEY;
        const deepseekApiKey = deepseekSetting?.value || process.env.DEEPSEEK_API_KEY;
        const hfApiKey = hfSetting?.value || process.env.HUGGINGFACE_API_KEY;

        console.log('API Key Check:', {
            hasVercelKey: !!vercelApiKey,
            hasDeepseekKey: !!deepseekApiKey,
            hasHFKey: !!hfApiKey,
            deepseekKeyPrefix: deepseekApiKey?.substring(0, 4)
        });

        // Determine which API to use
        let provider;
        let modelName: string;

        const isVercelKey = vercelApiKey || (deepseekApiKey && deepseekApiKey.startsWith('vck_'));

        if (isVercelKey) {
            const apiKey = vercelApiKey || deepseekApiKey;
            console.log('Using Vercel AI Gateway with Protocol Transformation');

            provider = createOpenAI({
                apiKey: apiKey!,
                baseURL: 'https://api.openai.com/v1',
                fetch: async (url, options) => {
                    const targetUrl = 'https://ai-gateway.vercel.sh/v1/chat/completions';
                    console.log('AI SDK Intercepted -> Redirecting to:', targetUrl);

                    let body = options.body;
                    if (typeof body === 'string') {
                        try {
                            const parsedBody = JSON.parse(body);
                            // Transform Vercel protocol to OpenAI protocol
                            if (parsedBody.input && !parsedBody.messages) {
                                parsedBody.messages = parsedBody.input.map((msg: any) => ({
                                    role: msg.role === 'developer' ? 'system' : msg.role,
                                    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
                                }));
                                delete parsedBody.input;

                                if (Array.isArray(parsedBody.tools)) {
                                    parsedBody.tools = parsedBody.tools.map((tool: any) => {
                                        if (tool.type === 'function' && !tool.function) {
                                            return {
                                                type: 'function',
                                                function: {
                                                    name: tool.name,
                                                    description: tool.description,
                                                    parameters: tool.parameters,
                                                    strict: tool.strict
                                                }
                                            };
                                        }
                                        return tool;
                                    });
                                }
                            }
                            parsedBody.model = 'deepseek/deepseek-chat';
                            body = JSON.stringify(parsedBody);
                        } catch (e) {
                            console.error('Body parse error:', e);
                        }
                    }

                    const response = await fetch(targetUrl, {
                        ...options,
                        body: body
                    });

                    if (!response.ok) return response;

                    // Transform OpenAI stream to Vercel protocol stream
                    const reader = response.body?.getReader();
                    const encoder = new TextEncoder();
                    const decoder = new TextDecoder();

                    const stream = new ReadableStream({
                        async start(controller) {
                            try {
                                while (true) {
                                    const { done, value } = await reader!.read();
                                    if (done) break;

                                    const chunk = decoder.decode(value);
                                    const lines = chunk.split('\n');

                                    for (const line of lines) {
                                        if (line.startsWith('data: ')) {
                                            const data = line.slice(6);
                                            if (data === '[DONE]') continue;

                                            try {
                                                const json = JSON.parse(data);
                                                const content = json.choices?.[0]?.delta?.content;
                                                if (content) {
                                                    // Vercel protocol format for text: 0:"text"
                                                    controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`));
                                                }
                                            } catch (e) {
                                                // Ignore parse errors for partial chunks
                                            }
                                        }
                                    }
                                }
                            } catch (error) {
                                console.error('Stream processing error:', error);
                            } finally {
                                controller.close();
                            }
                        }
                    });

                    return new Response(stream, {
                        headers: {
                            'Content-Type': 'text/plain; charset=utf-8',
                            'x-vercel-ai-data-stream': 'v1',
                        }
                    });
                }
            });
            modelName = 'gpt-3.5-turbo'; // Force OpenAI provider logic
        } else if (deepseekApiKey) {
            console.log('Using DeepSeek directly');
            provider = createOpenAI({
                apiKey: deepseekApiKey,
                baseURL: 'https://api.deepseek.com',
            });
            modelName = 'deepseek-chat';
        } else if (hfApiKey) {
            console.log('Using Hugging Face');
            provider = createHuggingFace({
                apiKey: hfApiKey,
            });
            modelName = 'mistralai/Mistral-7B-Instruct-v0.2';
        } else {
            console.error('No AI API Key found');
            return new Response('No AI API Key configured. Please add VERCEL_AI_GATEWAY_KEY, DEEPSEEK_API_KEY, or HUGGINGFACE_API_KEY in Settings.', { status: 500 });
        }

        const result = await streamText({
            model: provider(modelName),
            system: `You are Shamiur Rashid Sunny's AI Agent, a virtual Fullstack Developer, DevSecOps engineer, and AI/ML professional.
      Your goal is to manage Shamiur's business operations autonomously.
      
      Capabilities:
      1. **Prototype Builder**: Gather requirements (Project Name, Description, Tech Stack, Features, Client Email) and call 'createPrototype'.
      2. **Automation**: Trigger external workflows on Make.com or Zapier using 'triggerAutomation'.
      3. **Social Media**: Post to YouTube or Twitter using 'manageSocialMedia'.
      4. **Freelance Hunter**: Scan for projects using 'scanProjects'.
      
      Be professional, technical, and proactive. Provide high-quality responses.`,
            messages,
            tools: {
                createPrototype: tool({
                    description: 'Create a new project prototype, GitHub repository, and send email to client.',
                    parameters: z.object({
                        projectName: z.string().describe('The name of the project'),
                        description: z.string().describe('Detailed project description'),
                        techStack: z.string().describe('Comma separated list of technologies'),
                        features: z.array(z.string()).describe('List of key features'),
                        clientEmail: z.string().email().describe('The email address of the client'),
                    }),
                    execute: async ({ projectName, description, techStack, features, clientEmail }) => {
                        console.log('Triggering build for:', projectName);
                        try {
                            await db.aiLog.create({
                                data: {
                                    action: 'CREATE_PROTOTYPE',
                                    details: `Project: ${projectName}, Client: ${clientEmail}`,
                                    status: 'IN_PROGRESS'
                                }
                            });
                            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
                            fetch(`${baseUrl}/api/ai/agent/build`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ projectName, description, techStack, features, clientEmail })
                            }).catch(err => console.error('Build service call failed:', err));
                            return { success: true, message: `Build initiated for ${projectName}.` };
                        } catch (error) {
                            console.error('Build initiation error:', error);
                            return { success: false, error: 'Failed to initiate build' };
                        }
                    },
                }),
                triggerAutomation: tool({
                    description: 'Trigger an external automation workflow (Make.com or Zapier).',
                    parameters: z.object({
                        pluginName: z.enum(['make', 'zapier']).describe('The automation platform to use'),
                        action: z.string().describe('The specific action to trigger'),
                        data: z.any().describe('The data to send to the automation'),
                    }),
                    execute: async ({ pluginName, action, data }) => {
                        try {
                            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
                            const response = await fetch(`${baseUrl}/api/ai/agent/automate`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ pluginName, action, data })
                            });
                            return await response.json();
                        } catch (error) {
                            console.error('Automation trigger error:', error);
                            return { success: false, error: 'Failed to trigger automation' };
                        }
                    },
                }),
                manageSocialMedia: tool({
                    description: 'Manage social media profiles (YouTube, Twitter).',
                    parameters: z.object({
                        platform: z.enum(['youtube', 'twitter']).describe('The platform to manage'),
                        action: z.string().describe('The action to perform (e.g., tweet, upload_metadata)'),
                        content: z.string().optional().describe('The content to post'),
                        title: z.string().optional().describe('Title for YouTube'),
                        description: z.string().optional().describe('Description for YouTube'),
                    }),
                    execute: async (params) => {
                        try {
                            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
                            const response = await fetch(`${baseUrl}/api/ai/agent/social`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(params)
                            });
                            return await response.json();
                        } catch (error) {
                            console.error('Social media management error:', error);
                            return { success: false, error: 'Failed to manage social media' };
                        }
                    },
                }),
                scanProjects: tool({
                    description: 'Scan freelancing sites (e.g., Freelancer) for projects based on keywords.',
                    parameters: z.object({
                        platform: z.enum(['freelancer']).describe('The platform to scan'),
                        keywords: z.string().describe('Keywords to search for'),
                    }),
                    execute: async ({ platform, keywords }) => {
                        try {
                            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
                            const response = await fetch(`${baseUrl}/api/ai/agent/scan`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ platform, keywords })
                            });
                            return await response.json();
                        } catch (error) {
                            console.error('Project scanning error:', error);
                            return { success: false, error: 'Failed to scan projects' };
                        }
                    },
                }),
            },
        });

        console.log('StreamText Result:', {
            hasToDataStreamResponse: typeof result.toDataStreamResponse === 'function',
            hasToTextStreamResponse: typeof result.toTextStreamResponse === 'function',
        });

        if (typeof result.toTextStreamResponse === 'function') {
            return result.toTextStreamResponse();
        } else if (typeof result.toDataStreamResponse === 'function') {
            return result.toDataStreamResponse();
        } else {
            throw new Error('StreamText result does not have a valid response method');
        }
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
