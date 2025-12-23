// Multi-AI Team Coordination System
import { createOpenAI } from '@ai-sdk/openai';
import { AgentTaskManager, AgentCoordinator } from './super-agent-db';

// AI Team Configuration
export const AI_TEAM_CONFIG = {
    BUSINESS_MANAGER: {
        name: 'DeepSeek Business Manager',
        model: 'deepseek-chat',
        role: 'BUSINESS_MANAGER',
        description: 'Chat, email, business management, client communication, project coordination',
        capabilities: ['client_communication', 'email_automation', 'business_decisions', 'project_coordination', 'quotation_generation', 'client_management', 'business_analysis']
    },
    SENIOR_WORKER: {
        name: 'Mistral Devstral Senior Worker',
        model: 'mistral-large-latest',
        role: 'SENIOR_DEVELOPER',
        description: 'Architecture design, complex development, code review',
        capabilities: ['system_architecture', 'complex_coding', 'code_review', 'tech_decisions']
    },
    JUNIOR_WORKER: {
        name: 'Mistral Devstral Junior Worker',
        model: 'mistral-small-latest',
        role: 'JUNIOR_DEVELOPER',
        description: 'Basic coding, file editing, implementation',
        capabilities: ['basic_coding', 'file_editing', 'code_implementation', 'documentation']
    },
    TESTING_WORKER: {
        name: 'KAT-Coder Testing Worker',
        model: 'novita-ai/kat-coder-pro-v1',
        role: 'TESTING_QA',
        description: 'Testing, QA, validation (73.4% SWE-Bench score)',
        capabilities: ['test_writing', 'qa_validation', 'bug_detection', 'performance_testing']
    },
    DEVOPS_WORKER: {
        name: 'StreamLake DevOps Worker',
        model: 'streamlake/kat-coder-pro-v1',
        role: 'DEVOPS_DEPLOYMENT',
        description: 'Deployment, DevOps, infrastructure automation',
        capabilities: ['deployment', 'devops_automation', 'infrastructure', 'monitoring']
    },
    VISION_SPECIALIST: {
        name: 'GLM-4.6v-Flash Vision Specialist',
        model: 'z-ai/glm-4-6v-flash',
        role: 'VISION_REASONING',
        description: 'Advanced vision, reasoning, tool calling, streaming responses, and JSON output',
        capabilities: ['image_analysis', 'document_vision', 'visual_reasoning', 'tool_calling', 'streaming_responses', 'json_output', 'complex_reasoning', 'multi_modal_understanding']
    }
} as const;

export type AIRole = keyof typeof AI_TEAM_CONFIG;

// AI Provider Factory
class AIModelProvider {
    private static providers: Record<string, any> = {};

    static getProvider(modelName: string, apiKey: string) {
        if (!this.providers[modelName]) {
            const baseURL = this.getBaseURL(modelName);
            this.providers[modelName] = createOpenAI({
                apiKey,
                baseURL,
            });
        }
        return this.providers[modelName];
    }

    private static getBaseURL(modelName: string): string {
        // Map models to their respective providers
        if (modelName.includes('deepseek')) {
            return 'https://api.deepseek.com';
        }
        if (modelName.includes('mistral')) {
            return 'https://api.mistral.ai/v1';
        }
        if (modelName.includes('kat-coder')) {
            return 'https://api.novita.ai/v1';
        }
        if (modelName.includes('glm-4')) {
            return 'https://api.llmgateway.io/v1/'; // LLM Gateway for GLM-4.6v-Flash
        }
        return 'https://api.openai.com/v1';
    }

    static getModelId(modelName: string): string {
        const modelMap: Record<string, string> = {
            'deepseek-chat': 'deepseek-chat',
            'mistral-large-latest': 'mistral-large-latest',
            'mistral-small-latest': 'mistral-small-latest',
            'novita-ai/kat-coder-pro-v1': 'kat-coder-pro-v1',
            'z-ai/glm-4-6v-flash': 'glm-4.6v-flash'
        };
        return modelMap[modelName] || modelName;
    }
}

// Multi-AI Team Manager
export class MultiAITeamManager {
    private static taskAssignments: Map<string, string> = new Map();
    private static teamStatus: Map<AIRole, 'idle' | 'busy' | 'offline'> = new Map();

    // Initialize team status
    static initializeTeam() {
        Object.keys(AI_TEAM_CONFIG).forEach(role => {
            this.teamStatus.set(role as AIRole, 'idle');
        });
    }

    // Assign task to appropriate AI team member
    static async assignTask(
        taskId: string,
        taskType: string,
        payload: any,
        priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'
    ): Promise<AIRole> {
        const assignedRole = this.determineBestRole(taskType, payload, priority);

        // Set agent as busy
        this.teamStatus.set(assignedRole, 'busy');
        this.taskAssignments.set(taskId, assignedRole);

        // Create AI team member instance
        const teamMember = new AITeamMember(assignedRole);
        await teamMember.acceptTask(taskId, taskType, payload);

        return assignedRole;
    }

    // Determine best AI role for task
    private static determineBestRole(taskType: string, payload: any, priority: string): AIRole {
        // Critical/high priority tasks go to business manager for coordination
        if (priority === 'URGENT' || priority === 'HIGH') {
            return 'BUSINESS_MANAGER';
        }

        // Vision and reasoning tasks go to GLM-4.6v-Flash
        if (taskType === 'VISION_ANALYSIS' ||
            taskType === 'IMAGE_PROCESSING' ||
            taskType === 'DOCUMENT_ANALYSIS' ||
            taskType === 'VISUAL_REASONING' ||
            payload.hasImage ||
            payload.hasVisualContent) {
            return 'VISION_SPECIALIST';
        }

        // Complex reasoning tasks
        if (taskType === 'COMPLEX_REASONING' ||
            taskType === 'STRATEGIC_ANALYSIS' ||
            taskType === 'TOOL_CALLING') {
            return 'VISION_SPECIALIST';
        }

        // Task type routing logic
        switch (taskType) {
            case 'DEVELOPMENT':
                // Complex development → Senior Worker, Basic → Junior Worker
                if (payload.complexity === 'high' || payload.phase === 'architecture') {
                    return 'SENIOR_WORKER';
                }
                return 'JUNIOR_WORKER';

            case 'TESTING':
                return 'TESTING_WORKER';

            case 'DEPLOYMENT':
                return 'DEVOPS_WORKER';

            case 'CODE_REVIEW':
            case 'ARCHITECTURE':
                return 'SENIOR_WORKER';

            case 'BUSINESS_ANALYSIS':
            case 'CLIENT_COMMUNICATION':
                return 'BUSINESS_MANAGER';

            case 'DOCUMENTATION':
            case 'BASIC_CODING':
                return 'JUNIOR_WORKER';

            case 'PERFORMANCE_TESTING':
            case 'SECURITY_SCAN':
                return 'TESTING_WORKER';

            default:
                // Default to junior worker for unknown tasks
                return 'JUNIOR_WORKER';
        }
    }

    // Get team member status
    static getTeamStatus(): Record<AIRole, { status: string; currentTask?: string }> {
        const status: Record<AIRole, { status: string; currentTask?: string }> = {} as any;

        Object.entries(this.teamStatus).forEach(([role, statusValue]) => {
            const currentTask = Array.from(this.taskAssignments.entries())
                .find(([_, assignedRole]) => assignedRole === role)?.[0];

            status[role as AIRole] = {
                status: statusValue,
                currentTask
            };
        });

        return status;
    }

    // Complete task and free team member
    static completeTask(taskId: string) {
        const assignedRole = this.taskAssignments.get(taskId);
        if (assignedRole) {
            this.teamStatus.set(assignedRole as AIRole, 'idle');
            this.taskAssignments.delete(taskId);
        }
    }

    // Get available team member for task
    static getAvailableRole(preferredRole?: AIRole): AIRole | null {
        // If preferred role is available, use it
        if (preferredRole && this.teamStatus.get(preferredRole) === 'idle') {
            return preferredRole;
        }

        // Find any idle team member
        for (const [role, status] of this.teamStatus.entries()) {
            if (status === 'idle') {
                return role;
            }
        }

        return null; // All team members busy
    }
}

// Individual AI Team Member
class AITeamMember {
    private role: AIRole;
    private config: typeof AI_TEAM_CONFIG[keyof typeof AI_TEAM_CONFIG];
    private apiKey: string;

    constructor(role: AIRole) {
        this.role = role;
        this.config = AI_TEAM_CONFIG[role];
        this.apiKey = this.getAPIKey();
    }

    private getAPIKey(): string {
        // Get appropriate API key based on role
        const keyMap = {
            BUSINESS_MANAGER: 'DEEPSEEK_API_KEY',
            SENIOR_WORKER: 'MISTRAL_API_KEY',
            JUNIOR_WORKER: 'MISTRAL_API_KEY',
            TESTING_WORKER: 'NOVITA_API_KEY',
            DEVOPS_WORKER: 'ZAI_API_KEY',
            VISION_SPECIALIST: 'LLM_GATEWAY_API_KEY' // Uses LLM Gateway for GLM-4.6v-Flash
        };

        return process.env[keyMap[this.role]] || process.env.DEEPSEEK_API_KEY || '';
    }

    async acceptTask(taskId: string, taskType: string, payload: any) {
        const provider = AIModelProvider.getProvider(this.config.model, this.apiKey);
        const modelId = AIModelProvider.getModelId(this.config.model);

        // Generate role-specific prompt
        const prompt = this.generateTaskPrompt(taskType, payload);

        try {
            // Execute task with appropriate model
            const response = await provider.chat.completions.create({
                model: modelId,
                messages: [
                    {
                        role: 'system',
                        content: this.getSystemPrompt()
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 4000,
            });

            const result = response.choices[0].message.content || '';

            // Log task completion
            await this.logTaskCompletion(taskId, taskType, result);

            // Notify team coordinator
            await this.notifyCompletion(taskId, result);

        } catch (error) {
            console.error(`AI Team Member ${this.role} failed:`, error);
            await this.handleTaskFailure(taskId, error);
        }
    }

    private generateTaskPrompt(taskType: string, payload: any): string {
        const basePrompt = `Task Type: ${taskType}
Payload: ${JSON.stringify(payload, null, 2)}

Please execute this task using your specialized capabilities.`;

        // Add role-specific instructions
        switch (this.role) {
            case 'BUSINESS_MANAGER':
                return `${basePrompt}

As the Business Manager, please:
1. Handle client communication and business decisions
2. Coordinate project workflows and team assignments
3. Generate quotations and manage client relationships
4. Automate email communication and business processes
5. Provide business context and strategic decisions`;

            case 'SENIOR_WORKER':
                return `${basePrompt}

As Senior Developer, please:
1. Design the technical architecture
2. Create complex implementation solutions
3. Review and optimize code
4. Make technology decisions
5. Mentor junior developers`;

            case 'JUNIOR_WORKER':
                return `${basePrompt}

As Junior Developer, please:
1. Implement basic coding tasks
2. Edit and modify files
3. Write documentation
4. Follow senior developer guidance
5. Complete straightforward development work`;

            case 'TESTING_WORKER':
                return `${basePrompt}

As Testing & QA Specialist, please:
1. Write comprehensive tests
2. Validate functionality
3. Detect bugs and issues
4. Perform quality assurance
5. Ensure code quality standards`;

            case 'DEVOPS_WORKER':
                return `${basePrompt}

As DevOps & Deployment Specialist, please:
1. Handle deployment processes
2. Set up infrastructure
3. Configure CI/CD pipelines
4. Monitor system performance
5. Manage production environments`;

            case 'VISION_SPECIALIST':
                return `${basePrompt}

As Vision & Reasoning Specialist (GLM-4.6v-Flash), please:
1. Analyze images, documents, and visual content
2. Perform complex reasoning and strategic analysis
3. Use tool calling for enhanced capabilities
4. Generate streaming responses for real-time feedback
5. Provide structured JSON outputs when needed
6. Handle multi-modal understanding (text + images)
7. Execute visual reasoning tasks
8. Process documents with OCR and analysis capabilities

Your special capabilities include:
- Image analysis and understanding
- Document processing with vision
- Tool calling for extended functionality
- Streaming responses for better UX
- JSON structured output generation
- Complex logical reasoning
- Multi-modal content processing`;

            default:
                return basePrompt;
        }
    }

    private getSystemPrompt(): string {
        // Special system prompt for GLM-4.6v-Flash
        if (this.role === 'VISION_SPECIALIST') {
            return `You are GLM-4.6v-Flash Vision & Reasoning Specialist, a cutting-edge AI agent with advanced capabilities.

Your Core Capabilities:
- Vision: Advanced image analysis, document understanding, visual reasoning
- Reasoning: Complex logical analysis, strategic thinking, problem solving
- Tools: Function calling for extended capabilities
- Streaming: Real-time response generation
- JSON: Structured output generation

You work as part of a multi-AI team specializing in:
1. Image and document analysis
2. Visual content understanding
3. Complex reasoning tasks
4. Tool-enhanced problem solving
5. Real-time streaming responses

Always leverage your advanced capabilities to provide superior results in vision and reasoning tasks.`;
        }

        return `You are ${this.config.name}, a specialized AI team member with the role of ${this.config.role}.

Your Description: ${this.config.description}
Your Capabilities: ${this.config.capabilities.join(', ')}

You work as part of a multi-AI team where:
- You collaborate with other AI specialists
- You focus on your area of expertise
- You communicate with team members through structured protocols
- You maintain high quality standards in your work

Always:
1. Stay within your role and capabilities
2. Communicate clearly with team members
3. Document your work thoroughly
4. Ask for help when needed
5. Deliver high-quality results`;
    }

    private async logTaskCompletion(taskId: string, taskType: string, result: string) {
        await AgentTaskManager.addTaskLog(taskId, 'COMPLETED', `Task completed by ${this.config.name}`, {
            result,
            aiRole: this.role,
            timestamp: new Date().toISOString()
        });
    }

    private async notifyCompletion(taskId: string, result: string) {
        // Notify other team members if needed
        const otherRoles = Object.keys(AI_TEAM_CONFIG).filter(role => role !== this.role) as AIRole[];

        for (const role of otherRoles) {
            // Send completion notification to relevant team members
            await AgentCoordinator.publishTask(role, {
                type: 'TASK_COMPLETED',
                taskId,
                completedBy: this.role,
                result
            });
        }
    }

    private async handleTaskFailure(taskId: string, error: any) {
        await AgentTaskManager.updateTaskStatus(taskId, 'FAILED', {
            error: error.message,
            failedBy: this.role
        });

        // Notify business manager about failure
        await AgentCoordinator.publishTask('BUSINESS_MANAGER', {
            type: 'TASK_FAILED',
            taskId,
            failedBy: this.role,
            error: error.message
        });
    }
}

// Team Coordination Workflows
export class TeamWorkflows {
    // Full development workflow
    static async executeDevelopmentWorkflow(projectData: any): Promise<string> {
        const workflowId = `workflow_${Date.now()}`;

        try {
            // 1. Manager: Analyze requirements and create project plan
            const managerTask = await AgentTaskManager.createTask({
                type: 'PROJECT_ANALYSIS',
                title: 'Project Analysis & Planning',
                priority: 'HIGH',
                payload: { ...projectData, workflowId }
            });

            await MultiAITeamManager.assignTask(managerTask.id, 'BUSINESS_ANALYSIS', projectData, 'HIGH');

            // 2. Senior Dev: Architecture design
            const architectureTask = await AgentTaskManager.createTask({
                type: 'ARCHITECTURE',
                title: 'System Architecture Design',
                priority: 'HIGH',
                payload: { ...projectData, workflowId },
                parentId: managerTask.id
            });

            await MultiAITeamManager.assignTask(architectureTask.id, 'DEVELOPMENT', { ...projectData, phase: 'architecture' }, 'HIGH');

            // 3. Junior Dev: Implementation
            const implementationTask = await AgentTaskManager.createTask({
                type: 'DEVELOPMENT',
                title: 'Core Implementation',
                priority: 'HIGH',
                payload: { ...projectData, workflowId },
                parentId: architectureTask.id
            });

            await MultiAITeamManager.assignTask(implementationTask.id, 'DEVELOPMENT', { ...projectData, phase: 'implementation' }, 'MEDIUM');

            // 4. Testing QA: Comprehensive testing
            const testingTask = await AgentTaskManager.createTask({
                type: 'TESTING',
                title: 'Quality Assurance Testing',
                priority: 'MEDIUM',
                payload: { ...projectData, workflowId },
                parentId: implementationTask.id
            });

            await MultiAITeamManager.assignTask(testingTask.id, 'TESTING', { ...projectData, phase: 'testing' }, 'MEDIUM');

            // 5. DevOps: Deployment
            const deploymentTask = await AgentTaskManager.createTask({
                type: 'DEPLOYMENT',
                title: 'Production Deployment',
                priority: 'HIGH',
                payload: { ...projectData, workflowId },
                parentId: testingTask.id
            });

            await MultiAITeamManager.assignTask(deploymentTask.id, 'DEPLOYMENT', { ...projectData, phase: 'deployment' }, 'HIGH');

            return workflowId;
        } catch (error) {
            console.error('Development workflow failed:', error);
            throw error;
        }
    }

    // Quick task assignment
    static async quickAssign(taskType: string, payload: any): Promise<string> {
        const taskId = `quick_${Date.now()}`;
        await MultiAITeamManager.assignTask(taskId, taskType, payload, 'MEDIUM');
        return taskId;
    }

    // Get workflow status
    static getWorkflowStatus(workflowId: string): any {
        return {
            workflowId,
            status: 'in_progress',
            timestamp: new Date().toISOString()
        };
    }
}

// Export all components
export { AIModelProvider, AITeamMember };
