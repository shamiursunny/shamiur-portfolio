// Super Agent Database Utilities - Simplified Implementation
import { PrismaClient } from '@prisma/client';

// Initialize Prisma for PostgreSQL
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Agent Communication Channels (simplified)
export const AGENT_CHANNELS = {
    BUILD_AGENT: 'agent:build',
    DEPLOY_AGENT: 'agent:deploy',
    TEST_AGENT: 'agent:test',
    CLIENT_AGENT: 'agent:client',
    FREELANCE_AGENT: 'agent:freelance',
    QUOTATION_AGENT: 'agent:quotation',
    DEVELOPMENT_COORDINATOR: 'agent:coordinator',
} as const;

// Agent status cache (in-memory for now)
const agentStatuses: Record<string, 'idle' | 'busy' | 'offline'> = {};

// ===== CLIENT MANAGEMENT =====
export class ClientManager {
    static async createClient(data: {
        name: string;
        email: string;
        company?: string;
        phone?: string;
        website?: string;
        industry?: string;
        budget?: number;
        timezone?: string;
        preferences?: any;
    }) {
        return await db.client.create({
            data: {
                ...data,
                preferences: data.preferences || {},
            },
        });
    }

    static async getClientByEmail(email: string) {
        return await db.client.findUnique({
            where: { email },
            include: {
                projects: true,
                quotations: true,
                invoices: true,
            },
        });
    }

    static async getAllClients(activeOnly = true) {
        return await db.client.findMany({
            where: activeOnly ? { isActive: true } : {},
            include: {
                projects: true,
                quotations: true,
                _count: {
                    select: {
                        projects: true,
                        quotations: true,
                        invoices: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}

// ===== PROJECT MANAGEMENT =====
export class ProjectManager {
    static async createProject(data: {
        name: string;
        description: string;
        clientId: string;
        techStack: string[];
        estimatedHours: number;
        quotedPrice: number;
        requirements?: any;
    }) {
        return await db.project.create({
            data: {
                ...data,
                requirements: data.requirements || {},
            },
            include: {
                client: true,
                tasks: true,
            },
        });
    }

    static async getProject(id: string) {
        return await db.project.findUnique({
            where: { id },
            include: {
                client: true,
                tasks: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        logs: true,
                    },
                },
                invoices: true,
                assets: true,
            },
        });
    }

    static async updateProjectStatus(id: string, status: string, data?: any) {
        return await db.project.update({
            where: { id },
            data: {
                status: status as any,
                ...data,
            },
            include: {
                client: true,
                tasks: true,
            },
        });
    }

    static async getActiveProjects() {
        return await db.project.findMany({
            where: {
                status: {
                    in: ['PENDING', 'IN_PROGRESS', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT'],
                },
            },
            include: {
                client: true,
                tasks: {
                    where: {
                        status: { in: ['PENDING', 'IN_PROGRESS'] },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}

// ===== QUOTATION MANAGEMENT =====
export class QuotationManager {
    static async createQuotation(data: {
        clientId: string;
        projectName: string;
        features: string[];
        techStack: string[];
        timeline: string;
        price: number;
        currency?: string;
        discount?: number;
        taxes?: number;
        totalPrice: number;
        validUntil: Date;
        notes?: string;
        terms?: string;
        scope?: string;
        assumptions?: string;
        exclusions?: string;
        paymentTerms?: string;
    }) {
        return await db.quotation.create({
            data,
            include: {
                client: true,
            },
        });
    }

    static async getQuotations(status?: string) {
        return await db.quotation.findMany({
            where: status ? { status } : {},
            include: {
                client: true,
                invoices: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async sendQuotation(id: string) {
        return await db.quotation.update({
            where: { id },
            data: {
                status: 'SENT',
                validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            },
        });
    }
}

// ===== AGENT TASK MANAGEMENT =====
export class AgentTaskManager {
    static async createTask(data: {
        type: string;
        title: string;
        description?: string;
        priority: string;
        payload: any;
        projectId?: string;
        deadline?: Date;
        parentId?: string;
    }) {
        return await db.agentTask.create({
            data: {
                ...data,
                payload: data.payload || {},
            },
            include: {
                project: {
                    include: {
                        client: true,
                    },
                },
                parent: true,
                children: true,
                logs: true,
            },
        });
    }

    static async getTasks(filters?: {
        type?: string;
        status?: string;
        agentId?: string;
        priority?: string;
    }) {
        return await db.agentTask.findMany({
            where: filters || {},
            include: {
                project: {
                    include: {
                        client: true,
                    },
                },
                logs: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'asc' },
            ],
        });
    }

    static async updateTaskStatus(id: string, status: string, data?: any) {
        const updateData: any = {
            status: status as any,
            ...data,
        };

        if (status === 'IN_PROGRESS' && !data?.startedAt) {
            updateData.startedAt = new Date();
        } else if (status === 'COMPLETED') {
            updateData.completedAt = new Date();
            updateData.progress = 100;
        }

        return await db.agentTask.update({
            where: { id },
            data: updateData,
        });
    }

    static async addTaskLog(taskId: string, action: string, message: string, data?: any) {
        return await db.taskLog.create({
            data: {
                taskId,
                action,
                message,
                data: data || {},
            },
        });
    }
}

// ===== KV UTILITIES FOR AGENT COORDINATION =====
export class AgentCoordinator {
    static async publishTask(agentType: string, taskData: any) {
        const channel = AGENT_CHANNELS[agentType as keyof typeof AGENT_CHANNELS];
        if (!channel) throw new Error(`Unknown agent type: ${agentType}`);

        return await kv.publish(channel, {
            taskId: taskData.id,
            type: taskData.type,
            data: taskData.payload,
            timestamp: new Date().toISOString(),
        });
    }

    static async subscribeToAgent(agentType: string, callback: (message: any) => void) {
        const channel = AGENT_CHANNELS[agentType as keyof typeof AGENT_CHANNELS];
        if (!channel) throw new Error(`Unknown agent type: ${agentType}`);

        const subscriber = kv.subscribe(channel, (message) => {
            callback(message);
        });

        return subscriber;
    }

    static async setAgentStatus(agentId: string, status: 'idle' | 'busy' | 'offline') {
        return await kv.set(`agent:${agentId}:status`, status);
    }

    static async getAgentStatus(agentId: string) {
        return await kv.get(`agent:${agentId}:status`);
    }

    static async getActiveAgents() {
        const agentIds = await kv.keys('agent:*:status');
        const statuses: Record<string, string> = {};

        for (const key of agentIds) {
            const agentId = key.split(':')[1];
            const status = await kv.get(key);
            statuses[agentId] = status as string;
        }

        return statuses;
    }
}

// ===== BUSINESS METRICS =====
export class BusinessMetrics {
    static async recordMetric(metric: string, value: number, period: string, metadata?: any) {
        const now = new Date();
        let periodStart: Date;
        let periodEnd: Date;

        switch (period) {
            case 'DAILY':
                periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000);
                break;
            case 'WEEKLY':
                const dayOfWeek = now.getDay();
                periodStart = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
                periodEnd = new Date(periodStart.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case 'MONTHLY':
                periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
                periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                break;
            default:
                periodStart = now;
                periodEnd = now;
        }

        return await db.businessMetric.create({
            data: {
                metric,
                value,
                period,
                periodStart,
                periodEnd,
                metadata: metadata || {},
            },
        });
    }

    static async getMetrics(metric?: string, period?: string, limit = 100) {
        return await db.businessMetric.findMany({
            where: {
                ...(metric && { metric }),
                ...(period && { period }),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}

export default db;
