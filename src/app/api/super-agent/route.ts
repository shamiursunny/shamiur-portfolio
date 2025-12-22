// Super Agent Coordinator API - Main Orchestrator
import { NextRequest, NextResponse } from 'next/server';
import {
    ClientManager,
    ProjectManager,
    QuotationManager,
    AgentTaskManager,
    AgentCoordinator,
    BusinessMetrics,
    db
} from '@/lib/super-agent-db';
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, data } = body;

        console.log('🤖 Super Agent Action:', action, data);

        switch (action) {
            case 'CREATE_CLIENT':
                return await handleCreateClient(data);

            case 'GENERATE_QUOTATION':
                return await handleGenerateQuotation(data);

            case 'CREATE_PROJECT':
                return await handleCreateProject(data);

            case 'START_DEVELOPMENT':
                return await handleStartDevelopment(data);

            case 'SCAN_FREELANCE_JOBS':
                return await handleScanFreelanceJobs(data);

            case 'GET_AGENT_STATUS':
                return await handleGetAgentStatus();

            case 'CREATE_AUTOMATION_RULE':
                return await handleCreateAutomationRule(data);

            case 'GET_BUSINESS_METRICS':
                return await handleGetBusinessMetrics(data);

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Super Agent Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// ===== CLIENT MANAGEMENT =====
async function handleCreateClient(data: any) {
    const client = await ClientManager.createClient(data);

    // Record metric
    await BusinessMetrics.recordMetric('CLIENT_CREATED', 1, 'DAILY', {
        clientId: client.id,
        source: data.source || 'manual'
    });

    return NextResponse.json({
        success: true,
        message: 'Client created successfully',
        data: client
    });
}

// ===== QUOTATION GENERATION =====
async function handleGenerateQuotation(data: any) {
    const { clientId, projectDescription, techStack, timeline } = data;

    // Get client info
    const client = await db.client.findUnique({ where: { id: clientId } });
    if (!client) {
        return NextResponse.json(
            { error: 'Client not found' },
            { status: 404 }
        );
    }

    // Use AI to analyze project and generate quotation
    const openai = createOpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
        baseURL: process.env.DEEPSEEK_API_KEY ? 'https://api.deepseek.com' : undefined,
    });

    const analysisPrompt = `
Analyze this project and generate a detailed quotation:

Project: ${projectDescription}
Tech Stack: ${techStack.join(', ')}
Timeline: ${timeline}

Please provide:
1. Estimated hours for development
2. Feature breakdown with hours
3. Pricing based on $50/hour rate
4. Risk assessment
5. Technology recommendations

Respond in JSON format:
{
  "estimatedHours": number,
  "features": [array of features with hours],
  "basePrice": number,
  "riskLevel": "low|medium|high",
  "recommendations": [array of recommendations]
}
`;

    try {
        const aiResponse = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: analysisPrompt }],
            temperature: 0.3,
        });

        const aiAnalysis = JSON.parse(aiResponse.choices[0].message.content || '{}');

        // Calculate final pricing
        const basePrice = aiAnalysis.estimatedHours * 50;
        const riskMultiplier = aiAnalysis.riskLevel === 'high' ? 1.2 : aiAnalysis.riskLevel === 'medium' ? 1.1 : 1.0;
        const finalPrice = Math.round(basePrice * riskMultiplier);

        // Create quotation
        const quotation = await QuotationManager.createQuotation({
            clientId,
            projectName: `Project: ${projectDescription.substring(0, 50)}...`,
            features: aiAnalysis.features || [],
            techStack,
            timeline,
            price: basePrice,
            totalPrice: finalPrice,
            validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            notes: `Risk Level: ${aiAnalysis.riskLevel}. AI Analysis completed.`,
            terms: 'Standard terms and conditions apply.',
            scope: projectDescription,
        });

        // Record metric
        await BusinessMetrics.recordMetric('QUOTATION_CREATED', 1, 'DAILY', {
            quotationId: quotation.id,
            estimatedValue: finalPrice
        });

        return NextResponse.json({
            success: true,
            message: 'Quotation generated successfully',
            data: {
                quotation,
                aiAnalysis,
                finalPrice
            }
        });

    } catch (error) {
        console.error('AI Quotation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate quotation' },
            { status: 500 }
        );
    }
}

// ===== PROJECT CREATION =====
async function handleCreateProject(data: any) {
    const project = await ProjectManager.createProject(data);

    // Create initial development tasks
    const tasks = [
        {
            type: 'DEVELOPMENT',
            title: 'Project Setup & Architecture',
            description: 'Set up project structure, choose frameworks, and create initial architecture',
            priority: 'HIGH',
            payload: {
                projectId: project.id,
                phase: 'setup'
            },
            deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        },
        {
            type: 'DEVELOPMENT',
            title: 'Core Feature Development',
            description: 'Implement main project features',
            priority: 'HIGH',
            payload: {
                projectId: project.id,
                phase: 'development'
            },
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
        },
        {
            type: 'TESTING',
            title: 'Quality Assurance Testing',
            description: 'Comprehensive testing of all features',
            priority: 'MEDIUM',
            payload: {
                projectId: project.id,
                phase: 'testing'
            },
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days
        },
        {
            type: 'DEPLOYMENT',
            title: 'Production Deployment',
            description: 'Deploy to production environment',
            priority: 'MEDIUM',
            payload: {
                projectId: project.id,
                phase: 'deployment'
            },
            deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) // 12 days
        }
    ];

    // Create tasks
    for (const taskData of tasks) {
        await AgentTaskManager.createTask(taskData);
    }

    // Update project status
    await ProjectManager.updateProjectStatus(project.id, 'IN_PROGRESS');

    // Record metric
    await BusinessMetrics.recordMetric('PROJECT_CREATED', 1, 'DAILY', {
        projectId: project.id,
        clientId: (project as any).clientId,
        techStack: (project as any).techStack
    });

    return NextResponse.json({
        success: true,
        message: 'Project created with development tasks',
        data: project
    });
}

// ===== DEVELOPMENT START =====
async function handleStartDevelopment(data: any) {
    const { projectId, agentType = 'BUILD_AGENT' } = data;

    // Get project details
    const project = await ProjectManager.getProject(projectId);
    if (!project) {
        return NextResponse.json(
            { error: 'Project not found' },
            { status: 404 }
        );
    }

    // Check agent availability
    const agentStatus = await AgentCoordinator.getAgentStatus(agentType);
    if (agentStatus === 'busy') {
        return NextResponse.json(
            { error: 'Agent is currently busy' },
            { status: 409 }
        );
    }

    // Set agent as busy
    await AgentCoordinator.setAgentStatus(agentType, 'busy');

    // Create development task
    const task = await AgentTaskManager.createTask({
        type: 'DEVELOPMENT',
        title: `Start Development: ${project.name}`,
        description: `Begin development for project: ${project.description}`,
        priority: 'HIGH',
        payload: {
            projectId,
            clientId: project.clientId,
            techStack: project.techStack,
            requirements: project.requirements
        },
        projectId,
        deadline: new Date(Date.now() + project.estimatedHours * 60 * 60 * 1000) // Convert hours to ms
    });

    // Publish task to agent channel
    await AgentCoordinator.publishTask('BUILD_AGENT', {
        id: task.id,
        type: 'DEVELOPMENT',
        payload: task.payload
    });

    return NextResponse.json({
        success: true,
        message: 'Development started',
        data: {
            task,
            agentStatus: 'busy'
        }
    });
}

// ===== FREELANCE JOB SCANNING =====
async function handleScanFreelanceJobs(data: any) {
    const { platforms = ['FREELANCER', 'UPWORK'], keywords = [] } = data;

    // Create scanning tasks for each platform
    const scanTasks = [];

    for (const platform of platforms) {
        const task = await AgentTaskManager.createTask({
            type: 'FREELANCE_BIDDING',
            title: `Scan ${platform} for opportunities`,
            description: `Scan ${platform} for projects matching keywords: ${keywords.join(', ')}`,
            priority: 'MEDIUM',
            payload: {
                platform,
                keywords,
                scanType: 'opportunities'
            },
            deadline: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        });

        scanTasks.push(task);
    }

    // Publish to freelance agent
    await AgentCoordinator.publishTask('FREELANCE_AGENT', {
        action: 'SCAN_JOBS',
        platforms,
        keywords
    });

    return NextResponse.json({
        success: true,
        message: 'Freelance job scanning initiated',
        data: {
            tasks: scanTasks,
            platforms,
            keywords
        }
    });
}

// ===== AGENT STATUS =====
async function handleGetAgentStatus() {
    const activeAgents = await AgentCoordinator.getActiveAgents();

    return NextResponse.json({
        success: true,
        data: {
            agents: activeAgents,
            timestamp: new Date().toISOString()
        }
    });
}

// ===== AUTOMATION RULES =====
async function handleCreateAutomationRule(data: any) {
    const rule = await db.automationRule.create({
        data: {
            name: data.name,
            description: data.description,
            trigger: data.trigger,
            action: data.action,
            priority: data.priority || 0
        }
    });

    return NextResponse.json({
        success: true,
        message: 'Automation rule created',
        data: rule
    });
}

// ===== BUSINESS METRICS =====
async function handleGetBusinessMetrics(data: any) {
    const { metric, period, limit = 50 } = data;

    const metrics = await BusinessMetrics.getMetrics(metric, period, limit);

    return NextResponse.json({
        success: true,
        data: metrics
    });
}
