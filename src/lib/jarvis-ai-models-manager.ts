// JARVIS AI Models Manager
// Comprehensive AI model management with LLM Gateway integration

import OpenAI from 'openai';

export interface AIModel {
    id: string;
    name: string;
    provider: string;
    capabilities: {
        streaming: boolean;
        vision: boolean;
        tools: boolean;
        reasoning: boolean;
        jsonOutput: boolean;
        codeGeneration: boolean;
        textGeneration: boolean;
        conversation: boolean;
    };
    contextWindow: number;
    cost: number; // per 1K tokens
    speed: 'fast' | 'medium' | 'slow';
    quality: 'basic' | 'good' | 'excellent';
    useCases: string[];
    status: 'active' | 'inactive' | 'maintenance';
}

export interface AIModelRequest {
    model: string;
    messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string | Array<{
            type: 'text' | 'image_url';
            text?: string;
            image_url?: {
                url: string;
            };
        }>;
    }>;
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
    tools?: any[];
}

export interface AIModelResponse {
    success: boolean;
    content?: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    model: string;
    finishReason?: 'stop' | 'length' | 'content_filter';
    error?: string;
}

export class JarvisAIModelsManager {
    private openai: OpenAI;
    private models: Map<string, AIModel> = new Map();
    private activeModels: Map<string, AIModel> = new Map();
    private usageStats: Map<string, {
        requests: number;
        totalTokens: number;
        totalCost: number;
        averageResponseTime: number;
    }> = new Map();

    constructor() {
        // Initialize OpenAI client with LLM Gateway
        this.openai = new OpenAI({
            apiKey: 'llmgtwy_4d21pkpxw65nd6KExhaJ8JRJ00J9FL6CIx06kwjT',
            baseURL: 'https://api.llmgateway.io/v1/'
        });

        this.initializeModels();
        console.log('🤖 JARVIS AI Models Manager initialized');
    }

    private initializeModels(): void {
        const models: AIModel[] = [
            // Skip zai/glm-4.6v-flash as requested
            {
                id: 'glm-4.5-flash',
                name: 'GLM-4.5 Flash',
                provider: 'LLM Gateway',
                capabilities: {
                    streaming: true,
                    vision: true,
                    tools: true,
                    reasoning: true,
                    jsonOutput: true,
                    codeGeneration: true,
                    textGeneration: true,
                    conversation: true
                },
                contextWindow: 128000,
                cost: 0.001,
                speed: 'fast',
                quality: 'excellent',
                useCases: ['General AI', 'Code Generation', 'Reasoning', 'Vision'],
                status: 'active'
            },
            {
                id: 'nemotron-nano-9b-v2',
                name: 'Nemotron Nano 9B v2',
                provider: 'LLM Gateway',
                capabilities: {
                    streaming: true,
                    vision: false,
                    tools: true,
                    reasoning: true,
                    jsonOutput: true,
                    codeGeneration: true,
                    textGeneration: true,
                    conversation: true
                },
                contextWindow: 32768,
                cost: 0.0008,
                speed: 'fast',
                quality: 'good',
                useCases: ['Code Generation', 'Text Analysis', 'Reasoning'],
                status: 'active'
            },
            {
                id: 'llama-4-maverick-free',
                name: 'Llama 4 Maverick (Free)',
                provider: 'LLM Gateway',
                capabilities: {
                    streaming: true,
                    vision: true,
                    tools: true,
                    reasoning: true,
                    jsonOutput: true,
                    codeGeneration: true,
                    textGeneration: true,
                    conversation: true
                },
                contextWindow: 131072,
                cost: 0,
                speed: 'medium',
                quality: 'good',
                useCases: ['General AI', 'Vision', 'Free Tier Usage'],
                status: 'active'
            },
            {
                id: 'llama-4-scout-free',
                name: 'Llama 4 Scout (Free)',
                provider: 'LLM Gateway',
                capabilities: {
                    streaming: true,
                    vision: true,
                    tools: true,
                    reasoning: true,
                    jsonOutput: true,
                    codeGeneration: true,
                    textGeneration: true,
                    conversation: true
                },
                contextWindow: 131072,
                cost: 0,
                speed: 'medium',
                quality: 'good',
                useCases: ['General AI', 'Vision', 'Free Tier Usage'],
                status: 'active'
            },
            {
                id: 'llama-3.3-70b-instruct-free',
                name: 'Llama 3.3 70B Instruct (Free)',
                provider: 'LLM Gateway',
                capabilities: {
                    streaming: true,
                    vision: false,
                    tools: true,
                    reasoning: true,
                    jsonOutput: true,
                    codeGeneration: true,
                    textGeneration: true,
                    conversation: true
                },
                contextWindow: 128000,
                cost: 0,
                speed: 'slow',
                quality: 'excellent',
                useCases: ['General AI', 'Reasoning', 'Free Tier Usage'],
                status: 'active'
            },
            {
                id: 'gpt-oss-20b-free',
                name: 'GPT-OSS 20B (Free)',
                provider: 'LLM Gateway',
                capabilities: {
                    streaming: true,
                    vision: false,
                    tools: true,
                    reasoning: true,
                    jsonOutput: true,
                    codeGeneration: true,
                    textGeneration: true,
                    conversation: true
                },
                contextWindow: 32768,
                cost: 0,
                speed: 'medium',
                quality: 'good',
                useCases: ['Text Generation', 'Free Tier Usage'],
                status: 'active'
            },
            {
                id: 'kimi-k2-0905-free',
                name: 'Kimi K2 0905 (Free)',
                provider: 'LLM Gateway',
                capabilities: {
                    streaming: true,
                    vision: true,
                    tools: true,
                    reasoning: true,
                    jsonOutput: true,
                    codeGeneration: true,
                    textGeneration: true,
                    conversation: true
                },
                contextWindow: 200000,
                cost: 0,
                speed: 'fast',
                quality: 'excellent',
                useCases: ['General AI', 'Vision', 'Long Context', 'Free Tier Usage'],
                status: 'active'
            },
            {
                id: 'glm-4.5-air-free',
                name: 'GLM-4.5 Air (Free)',
                provider: 'LLM Gateway',
                capabilities: {
                    streaming: true,
                    vision: true,
                    tools: true,
                    reasoning: true,
                    jsonOutput: true,
                    codeGeneration: true,
                    textGeneration: true,
                    conversation: true
                },
                contextWindow: 128000,
                cost: 0,
                speed: 'fast',
                quality: 'good',
                useCases: ['General AI', 'Vision', 'Free Tier Usage'],
                status: 'active'
            },
            {
                id: 'deepseek-r1t2-chimera-free',
                name: 'DeepSeek R1T2 Chimera (Free)',
                provider: 'LLM Gateway',
                capabilities: {
                    streaming: true,
                    vision: false,
                    tools: true,
                    reasoning: true,
                    jsonOutput: true,
                    codeGeneration: true,
                    textGeneration: true,
                    conversation: true
                },
                contextWindow: 131072,
                cost: 0,
                speed: 'medium',
                quality: 'excellent',
                useCases: ['Reasoning', 'Code Generation', 'Free Tier Usage'],
                status: 'active'
            }
        ];

        // Initialize models and usage stats
        for (const model of models) {
            this.models.set(model.id, model);
            this.activeModels.set(model.id, model);
            this.usageStats.set(model.id, {
                requests: 0,
                totalTokens: 0,
                totalCost: 0,
                averageResponseTime: 0
            });
        }

        console.log(`✅ Loaded ${models.length} AI models`);
    }

    // ===== MODEL QUERYING =====

    async queryModel(request: AIModelRequest): Promise<AIModelResponse> {
        const startTime = Date.now();
        const modelId = request.model;

        try {
            // Validate model exists
            const model = this.models.get(modelId);
            if (!model) {
                throw new Error(`Model ${modelId} not found`);
            }

            if (model.status !== 'active') {
                throw new Error(`Model ${modelId} is not active`);
            }

            console.log(`🤖 Querying model: ${model.name}`);

            // Prepare request parameters
            const params: any = {
                model: modelId,
                messages: request.messages,
                max_tokens: request.maxTokens || 4000,
                temperature: request.temperature || 0.7,
                stream: request.stream || false
            };

            // Add tools if supported
            if (model.capabilities.tools && request.tools) {
                params.tools = request.tools;
            }

            // Make API call
            const response = await this.openai.chat.completions.create(params);

            // Extract response content
            const content = response.choices[0]?.message?.content || '';
            const usage = response.usage;

            // Update usage statistics
            this.updateUsageStats(modelId, usage, startTime);

            const responseTime = Date.now() - startTime;
            console.log(`✅ Model ${model.name} responded in ${responseTime}ms`);

            return {
                success: true,
                content,
                usage: usage ? {
                    promptTokens: usage.prompt_tokens,
                    completionTokens: usage.completion_tokens,
                    totalTokens: usage.total_tokens
                } : undefined,
                model: modelId,
                finishReason: response.choices[0]?.finish_reason
            };

        } catch (error) {
            console.error(`❌ Model query failed:`, error);
            return {
                success: false,
                content: '',
                model: modelId,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // ===== SMART MODEL SELECTION =====

    selectBestModel(taskType: string): string {
        const availableModels = Array.from(this.activeModels.values())
            .filter(model => model.status === 'active');

        switch (taskType) {
            case 'code_generation':
                return availableModels.find(m => m.capabilities.codeGeneration && m.speed === 'fast')?.id ||
                    availableModels.find(m => m.capabilities.codeGeneration)?.id ||
                    'glm-4.5-flash';

            case 'vision':
                return availableModels.find(m => m.capabilities.vision && m.speed === 'fast')?.id ||
                    availableModels.find(m => m.capabilities.vision)?.id ||
                    'glm-4.5-flash';

            case 'reasoning':
                return availableModels.find(m => m.capabilities.reasoning && m.quality === 'excellent')?.id ||
                    availableModels.find(m => m.capabilities.reasoning)?.id ||
                    'glm-4.5-flash';

            case 'general':
                return availableModels.find(m => m.capabilities.conversation && m.speed === 'fast')?.id ||
                    'glm-4.5-flash';

            case 'cost_effective':
                return availableModels.find(m => m.cost === 0)?.id ||
                    availableModels.sort((a, b) => a.cost - b.cost)[0]?.id ||
                    'glm-4.5-flash';

            case 'long_context':
                return availableModels.find(m => m.contextWindow > 100000)?.id ||
                    'glm-4.5-flash';

            default:
                return 'glm-4.5-flash';
        }
    }

    // ===== BATCH PROCESSING =====

    async queryMultipleModels(
        requests: AIModelRequest[],
        options?: {
            parallel?: boolean;
            fallback?: boolean;
        }
    ): Promise<{ [modelId: string]: AIModelResponse }> {
        const results: { [modelId: string]: AIModelResponse } = {};

        if (options?.parallel) {
            // Process in parallel
            const promises = requests.map(async (request) => {
                const result = await this.queryModel(request);
                return { modelId: request.model, result };
            });

            const responses = await Promise.allSettled(promises);
            responses.forEach((response, index) => {
                const modelId = requests[index].model;
                if (response.status === 'fulfilled') {
                    results[modelId] = response.value.result;
                } else {
                    results[modelId] = {
                        success: false,
                        content: '',
                        model: modelId,
                        error: response.reason?.message || 'Unknown error'
                    };
                }
            });
        } else {
            // Process sequentially
            for (const request of requests) {
                results[request.model] = await this.queryModel(request);
            }
        }

        return results;
    }

    // ===== MODEL MANAGEMENT =====

    getAllModels(): AIModel[] {
        return Array.from(this.models.values());
    }

    getActiveModels(): AIModel[] {
        return Array.from(this.activeModels.values());
    }

    getModel(modelId: string): AIModel | undefined {
        return this.models.get(modelId);
    }

    activateModel(modelId: string): boolean {
        const model = this.models.get(modelId);
        if (model) {
            model.status = 'active';
            this.activeModels.set(modelId, model);
            console.log(`✅ Activated model: ${model.name}`);
            return true;
        }
        return false;
    }

    deactivateModel(modelId: string): boolean {
        const model = this.models.get(modelId);
        if (model) {
            model.status = 'inactive';
            this.activeModels.delete(modelId);
            console.log(`⏸️ Deactivated model: ${model.name}`);
            return true;
        }
        return false;
    }

    // ===== USAGE ANALYTICS =====

    getUsageStats(modelId?: string): any {
        if (modelId) {
            return this.usageStats.get(modelId) || {
                requests: 0,
                totalTokens: 0,
                totalCost: 0,
                averageResponseTime: 0
            };
        }

        const totalStats = {
            totalRequests: 0,
            totalTokens: 0,
            totalCost: 0,
            averageResponseTime: 0,
            modelBreakdown: {} as any
        };

        for (const [id, stats] of this.usageStats) {
            totalStats.totalRequests += stats.requests;
            totalStats.totalTokens += stats.totalTokens;
            totalStats.totalCost += stats.totalCost;
            totalStats.averageResponseTime += stats.averageResponseTime;
            totalStats.modelBreakdown[id] = stats;
        }

        totalStats.averageResponseTime = totalStats.totalRequests > 0
            ? totalStats.averageResponseTime / this.usageStats.size
            : 0;

        return totalStats;
    }

    getRecommendations(taskType: string): AIModel[] {
        const availableModels = Array.from(this.activeModels.values())
            .filter(model => model.status === 'active');

        switch (taskType) {
            case 'code_generation':
                return availableModels
                    .filter(m => m.capabilities.codeGeneration)
                    .sort((a, b) => {
                        if (a.speed === 'fast' && b.speed !== 'fast') return -1;
                        if (a.speed !== 'fast' && b.speed === 'fast') return 1;
                        return a.cost - b.cost;
                    });

            case 'vision':
                return availableModels
                    .filter(m => m.capabilities.vision)
                    .sort((a, b) => {
                        if (a.speed === 'fast' && b.speed !== 'fast') return -1;
                        if (a.speed !== 'fast' && b.speed === 'fast') return 1;
                        return a.cost - b.cost;
                    });

            case 'cost_effective':
                return availableModels
                    .sort((a, b) => a.cost - b.cost);

            default:
                return availableModels.sort((a, b) => b.quality.localeCompare(a.quality));
        }
    }

    // ===== HEALTH CHECK =====

    async healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        activeModels: number;
        totalModels: number;
        lastCheck: string;
        issues?: string[];
    }> {
        const issues: string[] = [];
        let activeCount = 0;
        let totalCount = this.models.size;

        // Check model availability
        for (const [modelId, model] of this.models) {
            if (model.status === 'active') {
                activeCount++;

                // Quick health check for active models
                try {
                    const testResponse = await this.queryModel({
                        model: modelId,
                        messages: [{ role: 'user', content: 'Hello' }],
                        maxTokens: 10
                    });

                    if (!testResponse.success) {
                        issues.push(`Model ${modelId} health check failed: ${testResponse.error}`);
                    }
                } catch (error) {
                    issues.push(`Model ${modelId} health check error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        }

        let status: 'healthy' | 'degraded' | 'unhealthy';
        if (activeCount === 0) {
            status = 'unhealthy';
        } else if (issues.length > 0) {
            status = '
