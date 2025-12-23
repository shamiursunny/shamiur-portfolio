// AI Models Roles Integration for SUPER AI REG TEAM
// Role assignments and team integration for all LLM Gateway models

import { JarvisAIModelsManager, AIModel, AIModelRequest, AIModelResponse } from './jarvis-ai-models-manager';

export interface AIRole {
    id: string;
    name: string;
    specialty: string;
    primaryModels: string[];
    backupModels: string[];
    capabilities: {
        codeGeneration: boolean;
        visionProcessing: boolean;
        reasoning: boolean;
        contentCreation: boolean;
        dataAnalysis: boolean;
        automation: boolean;
        voiceCloning: boolean;
        videoAvatar: boolean;
        socialMedia: boolean;
    };
    taskTypes: string[];
    description: string;
    priority: number; // 1-10, higher = more important
}

export interface AIModelRoleAssignment {
    modelId: string;
    roleIds: string[];
    primaryRole: string;
    secondaryRoles: string[];
    performance: {
        speed: number; // 1-10
        quality: number; // 1-10
        reliability: number; // 1-10
        costEfficiency: number; // 1-10
    };
}

export class AIModelsRolesIntegration {
    private modelsManager: JarvisAIModelsManager;
    private roles: Map<string, AIRole> = new Map();
    private modelAssignments: Map<string, AIModelRoleAssignment> = new Map();

    constructor() {
        this.modelsManager = new JarvisAIModelsManager();
        this.initializeRoles();
        this.assignModelsToRoles();
        console.log('🎭 AI Models Roles Integration initialized');
    }

    private initializeRoles(): void {
        const roles: AIRole[] = [
            {
                id: 'code_master',
                name: 'Code Master',
                specialty: 'Advanced Programming & Development',
                primaryModels: ['glm-4.5-flash', 'nemotron-nano-9b-v2'],
                backupModels: ['deepseek-r1t2-chimera-free', 'llama-3.3-70b-instruct-free'],
                capabilities: {
                    codeGeneration: true,
                    visionProcessing: true,
                    reasoning: true,
                    contentCreation: true,
                    dataAnalysis: true,
                    automation: true,
                    voiceCloning: false,
                    videoAvatar: false,
                    socialMedia: false
                },
                taskTypes: ['code_generation', 'debugging', 'architecture', 'optimization'],
                description: 'Master of all programming languages, frameworks, and development tasks',
                priority: 10
            },
            {
                id: 'vision_analyst',
                name: 'Vision Analyst',
                specialty: 'Image & Video Analysis',
                primaryModels: ['glm-4.5-flash', 'kimi-k2-0905-free'],
                backupModels: ['llama-4-maverick-free', 'glm-4.5-air-free'],
                capabilities: {
                    codeGeneration: false,
                    visionProcessing: true,
                    reasoning: true,
                    contentCreation: true,
                    dataAnalysis: true,
                    automation: false,
                    voiceCloning: false,
                    videoAvatar: false,
                    socialMedia: false
                },
                taskTypes: ['vision', 'image_analysis', 'video_processing', 'ocr'],
                description: 'Expert in analyzing images, videos, and visual content',
                priority: 9
            },
            {
                id: 'reasoning_expert',
                name: 'Reasoning Expert',
                specialty: 'Complex Problem Solving & Logic',
                primaryModels: ['llama-3.3-70b-instruct-free', 'deepseek-r1t2-chimera-free'],
                backupModels: ['glm-4.5-flash', 'kimi-k2-0905-free'],
                capabilities: {
                    codeGeneration: true,
                    visionProcessing: false,
                    reasoning: true,
                    contentCreation: true,
                    dataAnalysis: true,
                    automation: true,
                    voiceCloning: false,
                    videoAvatar: false,
                    socialMedia: false
                },
                taskTypes: ['reasoning', 'analysis', 'problem_solving', 'logic'],
                description: 'Specialist in logical reasoning and complex problem solving',
                priority: 9
            },
            {
                id: 'content_creator',
                name: 'Content Creator',
                specialty: 'Creative Writing & Content Generation',
                primaryModels: ['kimi-k2-0905-free', 'llama-4-maverick-free'],
                backupModels: ['gpt-oss-20b-free', 'llama-4-scout-free'],
                capabilities: {
                    codeGeneration: false,
                    visionProcessing: true,
                    reasoning: true,
                    contentCreation: true,
                    dataAnalysis: false,
                    automation: true,
                    voiceCloning: false,
                    videoAvatar: false,
                    socialMedia: true
                },
                taskTypes: ['content_creation', 'writing', 'storytelling', 'copywriting'],
                description: 'Master of creative content, writing, and storytelling',
                priority: 8
            },
            {
                id: 'data_analyst',
                name: 'Data Analyst',
                specialty: 'Data Processing & Insights',
                primaryModels: ['nemotron-nano-9b-v2', 'gpt-oss-20b-free'],
                backupModels: ['glm-4.5-flash', 'deepseek-r1t2-chimera-free'],
                capabilities: {
                    codeGeneration: true,
                    visionProcessing: false,
                    reasoning: true,
                    contentCreation: false,
                    dataAnalysis: true,
                    automation: true,
                    voiceCloning: false,
                    videoAvatar: false,
                    socialMedia: false
                },
                taskTypes: ['data_analysis', 'statistics', 'reporting', 'insights'],
                description: 'Expert in data processing, analysis, and generating insights',
                priority: 8
            },
            {
                id: 'automation_specialist',
                name: 'Automation Specialist',
                specialty: 'Process Automation & Workflows',
                primaryModels: ['glm-4.5-air-free', 'llama-4-scout-free'],
                backupModels: ['glm-4.5-flash', 'nemotron-nano-9b-v2'],
                capabilities: {
                    codeGeneration: true,
                    visionProcessing: true,
                    reasoning: true,
                    contentCreation: true,
                    dataAnalysis: true,
                    automation: true,
                    voiceCloning: false,
                    videoAvatar: false,
                    socialMedia: false
                },
                taskTypes: ['automation', 'workflows', 'integration', 'optimization'],
                description: 'Specialist in automating processes and workflows',
                priority: 7
            },
            {
                id: 'voice_specialist',
                name: 'Voice Specialist',
                specialty: 'Voice & Audio Processing',
                primaryModels: ['glm-4.5-flash', 'kimi-k2-0905-free'],
                backupModels: ['llama-4-maverick-free', 'gpt-oss-20b-free'],
                capabilities: {
                    codeGeneration: false,
                    visionProcessing: false,
                    reasoning: true,
                    contentCreation: true,
                    dataAnalysis: false,
                    automation: false,
                    voiceCloning: true,
                    videoAvatar: false,
                    socialMedia: false
                },
                taskTypes: ['voice_processing', 'audio_analysis', 'speech_synthesis'],
                description: 'Expert in voice processing and audio-related tasks',
                priority: 6
            },
            {
                id: 'video_specialist',
                name: 'Video Specialist',
                specialty: 'Video & Avatar Management',
                primaryModels: ['kimi-k2-0905-free', 'glm-4.5-air-free'],
                backupModels: ['llama-4-maverick-free', 'glm-4.5-flash'],
                capabilities: {
                    codeGeneration: false,
                    visionProcessing: true,
                    reasoning: true,
                    contentCreation: true,
                    dataAnalysis: false,
                    automation: false,
                    voiceCloning: false,
                    videoAvatar: true,
                    socialMedia: false
                },
                taskTypes: ['video_processing', 'avatar_management', 'visual_effects'],
                description: 'Specialist in video processing and avatar management',
                priority: 6
            },
            {
                id: 'social_media_expert',
                name: 'Social Media Expert',
                specialty: 'Social Media Management & Automation',
                primaryModels: ['llama-4-maverick-free', 'gpt-oss-20b-free'],
                backupModels: ['glm-4.5-air-free', 'kimi-k2-0905-free'],
                capabilities: {
                    codeGeneration: false,
                    visionProcessing: true,
                    reasoning: true,
                    contentCreation: true,
                    dataAnalysis: false,
                    automation: true,
                    voiceCloning: false,
                    videoAvatar: false,
                    socialMedia: true
                },
                taskTypes: ['social_media', 'content_automation', 'marketing', 'engagement'],
                description: 'Expert in social media management and automated content creation',
                priority: 5
            },
            {
                id: 'general_assistant',
                name: 'General Assistant',
                specialty: 'General Purpose & Support Tasks',
                primaryModels: ['glm-4.5-flash', 'kimi-k2-0905-free'],
                backupModels: ['llama-4-maverick-free', 'gpt-oss-20b-free'],
                capabilities: {
                    codeGeneration: true,
                    visionProcessing: true,
                    reasoning: true,
                    contentCreation: true,
                    dataAnalysis: true,
                    automation: true,
                    voiceCloning: false,
                    videoAvatar: false,
                    socialMedia: false
                },
                taskTypes: ['general', 'conversation', 'support', 'general_tasks'],
                description: 'Versatile assistant for general-purpose tasks and conversations',
                priority: 4
            }
        ];

        // Initialize roles
        for (const role of roles) {
            this.roles.set(role.id, role);
        }

        console.log(`✅ Initialized ${roles.length} AI roles`);
    }

    private assignModelsToRoles(): void {
        const models = this.modelsManager.getAllModels();

        for (const model of models) {
            const assignment: AIModelRoleAssignment = {
                modelId: model.id,
                roleIds: [],
                primaryRole: '',
                secondaryRoles: [],
                performance: {
                    speed: this.getSpeedScore(model.speed),
                    quality: this.getQualityScore(model.quality),
                    reliability: 8, // Default reliability score
                    costEfficiency: this.getCostEfficiencyScore(model.cost)
                }
            };

            // Assign roles based on model capabilities
            if (model.capabilities.codeGeneration && model.speed === 'fast') {
                assignment.roleIds.push('code_master');
                if (!assignment.primaryRole) assignment.primaryRole = 'code_master';
            }

            if (model.capabilities.vision) {
                assignment.roleIds.push('vision_analyst');
                if (!assignment.primaryRole) assignment.primaryRole = 'vision_analyst';
            }

            if (model.capabilities.reasoning && model.quality === 'excellent') {
                assignment.roleIds.push('reasoning_expert');
                if (!assignment.primaryRole && assignment.roleIds.length === 0) {
                    assignment.primaryRole = 'reasoning_expert';
                }
            }

            if (model.capabilities.conversation && model.cost === 0) {
                assignment.roleIds.push('general_assistant');
                if (!assignment.primaryRole) assignment.primaryRole = 'general_assistant';
            }

            // Add secondary roles
            if (model.capabilities.textGeneration) {
                if (!assignment.roleIds.includes('content_creator')) {
                    assignment.roleIds.push('content_creator');
                    assignment.secondaryRoles.push('content_creator');
                }
            }

            if (model.contextWindow > 100000) {
                if (!assignment.roleIds.includes('data_analyst')) {
                    assignment.roleIds.push('data_analyst');
                    assignment.secondaryRoles.push('data_analyst');
                }
            }

            // Ensure every model has at least one role
            if (assignment.roleIds.length === 0) {
                assignment.roleIds.push('general_assistant');
                assignment.primaryRole = 'general_assistant';
            }

            this.modelAssignments.set(model.id, assignment);
        }

        console.log(`✅ Assigned roles to ${models.length} models`);
    }

    private getSpeedScore(speed: string): number {
        switch (speed) {
            case 'fast': return 9;
            case 'medium': return 6;
            case 'slow': return 3;
            default: return 5;
        }
    }

    private getQualityScore(quality: string): number {
        switch (quality) {
            case 'excellent': return 9;
            case 'good': return 7;
            case 'basic': return 5;
            default: return 6;
        }
    }

    private getCostEfficiencyScore(cost: number): number {
        if (cost === 0) return 10;
        if (cost < 0.001) return 8;
        if (cost < 0.01) return 6;
        return 3;
    }

    // ===== PUBLIC API =====

    getAllRoles(): AIRole[] {
        return Array.from(this.roles.values()).sort((a, b) => b.priority - a.priority);
    }

    getRole(roleId: string): AIRole | undefined {
        return this.roles.get(roleId);
    }

    getModelsForRole(roleId: string): AIModel[] {
        const role = this.roles.get(roleId);
        if (!role) return [];

        const models: AIModel[] = [];
        for (const modelId of [...role.primaryModels, ...role.backupModels]) {
            const model = this.modelsManager.getModel(modelId);
            if (model && model.status === 'active') {
                models.push(model);
            }
        }
        return models;
    }

    getBestModelForTask(taskType: string): AIModel | null {
        // Find the best role for this task
        const bestRole = this.findBestRoleForTask(taskType);
        if (!bestRole) return null;

        // Get the best model for this role
        const models = this.getModelsForRole(bestRole.id);
        if (models.length === 0) return null;

        // Sort by performance score and return the best
        return models.sort((a, b) => {
            const assignmentA = this.modelAssignments.get(a.id);
            const assignmentB = this.modelAssignments.get(b.id);

            if (!assignmentA || !assignmentB) return 0;

            const scoreA = (assignmentA.performance.speed + assignmentA.performance.quality + assignmentA.performance.reliability) / 3;
            const scoreB = (assignmentB.performance.speed + assignmentB.performance.quality + assignmentB.performance.reliability) / 3;

            return scoreB - scoreA;
        })[0];
    }

    private findBestRoleForTask(taskType: string): AIRole | null {
        let bestRole: AIRole | null = null;
        let bestScore = 0;

        for (const role of this.roles.values()) {
            let score = 0;

            // Check if role handles this task type
            if (role.taskTypes.includes(taskType)) {
                score += 10;
            }

            // Check capabilities match
            switch (taskType) {
                case 'code_generation':
                    if (role.capabilities.codeGeneration) score += 8;
                    break;
                case 'vision':
                    if (role.capabilities.visionProcessing) score += 8;
                    break;
                case 'reasoning':
                    if (role.capabilities.reasoning) score += 8;
                    break;
                case 'general':
                    if (role.capabilities.contentCreation) score += 6;
                    break;
                default:
                    score += 4;
            }

            // Factor in role priority
            score += role.priority;

            if (score > bestScore) {
                bestScore = score;
                bestRole = role;
            }
        }

        return bestRole;
    }

    async queryWithRole(taskType: string, messages: any[], options?: any): Promise<AIModelResponse> {
        const bestModel = this.getBestModelForTask(taskType);
        if (!bestModel) {
            throw new Error(`No suitable model found for task type: ${taskType}`);
        }

        console.log(`🎯 Using ${bestModel.name} for ${taskType} task`);

        const request: AIModelRequest = {
            model: bestModel.id,
            messages,
            maxTokens: options?.maxTokens || 4000,
            temperature: options?.temperature || 0.7,
            stream: options?.stream || false
        };

        return await this.modelsManager.queryModel(request);
    }

    getTeamOverview(): any {
        const roles = this.getAllRoles();
        const overview = {
            totalRoles: roles.length,
            totalModels: this.modelsManager.getAllModels().length,
            activeModels: this.modelsManager.getActiveModels().length,
            roles: roles.map(role => ({
                id: role.id,
                name: role.name,
                priority: role.priority,
                modelCount: this.getModelsForRole(role.id).length,
                specialties: role.specialty
            }))
        };

        return overview;
    }

    getModelAssignments(): AIModelRoleAssignment[] {
        return Array.from(this.modelAssignments.values());
    }

    async runHealthCheck(): Promise<any> {
        const healthStatus = await this.modelsManager.healthCheck();
        const teamOverview = this.getTeamOverview();

        return {
            ...healthStatus,
            teamOverview,
            rolesHealth: this.checkRolesHealth()
        };
    }

    private checkRolesHealth(): any {
        const rolesHealth: any = {};

        for (const role of this.roles.values()) {
            const models = this.getModelsForRole(role.id);
            rolesHealth[role.id] = {
                name: role.name,
                availableModels: models.length,
                requiredModels: role.primaryModels.length,
                health: models.length >= role.primaryModels.length ? 'healthy' :
                    models.length > 0 ? 'partial' : 'unhealthy'
            };
        }

        return rolesHealth;
    }
}