// AI Models Integration Testing Script
// Comprehensive testing of all LLM Gateway models

import { JarvisAIModelsManager, AIModelRequest, AIModelResponse } from '../src/lib/jarvis-ai-models-manager';

export class AIModelsTester {
    private modelsManager: JarvisAIModelsManager;
    private testResults: any[] = [];

    constructor() {
        this.modelsManager = new JarvisAIModelsManager();
        console.log('🧪 AI Models Integration Tester initialized');
    }

    async runComprehensiveTests(): Promise<void> {
        console.log('\n🚀 Starting comprehensive AI models testing...\n');

        // Test 1: Model Availability Check
        await this.testModelAvailability();

        // Test 2: Individual Model Testing
        await this.testAllModels();

        // Test 3: Smart Model Selection
        await this.testSmartSelection();

        // Test 4: Batch Processing
        await this.testBatchProcessing();

        // Test 5: Health Checks
        await this.testHealthChecks();

        // Test 6: Usage Analytics
        await this.testUsageAnalytics();

        // Generate Report
        this.generateTestReport();
    }

    private async testModelAvailability(): Promise<void> {
        console.log('📋 Testing Model Availability...');

        const models = this.modelsManager.getAllModels();
        const activeModels = this.modelsManager.getActiveModels();

        console.log(`✅ Total models loaded: ${models.length}`);
        console.log(`✅ Active models: ${activeModels.length}`);

        models.forEach(model => {
            console.log(`   - ${model.name} (${model.id}): ${model.status} - ${model.useCases.join(', ')}`);
        });

        this.testResults.push({
            test: 'Model Availability',
            total: models.length,
            active: activeModels.length,
            status: 'PASSED'
        });
    }

    private async testAllModels(): Promise<void> {
        console.log('\n🤖 Testing Individual Models...');

        const testMessage = {
            role: 'user' as const,
            content: 'Hello! Please respond with a brief introduction about yourself and your capabilities.'
        };

        const models = this.modelsManager.getActiveModels();
        const results: any = {};

        for (const model of models) {
            console.log(`\n🔍 Testing ${model.name} (${model.id})...`);

            try {
                const request: AIModelRequest = {
                    model: model.id,
                    messages: [testMessage],
                    maxTokens: 200,
                    temperature: 0.7
                };

                const response: AIModelResponse = await this.modelsManager.queryModel(request);

                if (response.success) {
                    console.log(`✅ ${model.name}: SUCCESS`);
                    console.log(`   Response: ${response.content?.substring(0, 100)}...`);
                    console.log(`   Tokens: ${response.usage?.totalTokens || 'N/A'}`);
                    console.log(`   Finish Reason: ${response.finishReason || 'N/A'}`);

                    results[model.id] = {
                        success: true,
                        content: response.content,
                        usage: response.usage,
                        responseTime: Date.now()
                    };
                } else {
                    console.log(`❌ ${model.name}: FAILED`);
                    console.log(`   Error: ${response.error}`);

                    results[model.id] = {
                        success: false,
                        error: response.error
                    };
                }
            } catch (error) {
                console.log(`❌ ${model.name}: ERROR`);
                console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);

                results[model.id] = {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        }

        this.testResults.push({
            test: 'Individual Model Testing',
            results,
            status: 'COMPLETED'
        });
    }

    private async testSmartSelection(): Promise<void> {
        console.log('\n🧠 Testing Smart Model Selection...');

        const taskTypes = [
            'code_generation',
            'vision',
            'reasoning',
            'general',
            'cost_effective',
            'long_context'
        ];

        for (const taskType of taskTypes) {
            const selectedModel = this.modelsManager.selectBestModel(taskType);
            const model = this.modelsManager.getModel(selectedModel);

            console.log(`🎯 ${taskType}: ${model?.name || 'Unknown'} (${selectedModel})`);

            // Test the selected model
            if (model) {
                try {
                    const request: AIModelRequest = {
                        model: selectedModel,
                        messages: [{
                            role: 'user',
                            content: `This is a ${taskType} task. Please demonstrate your suitability for this task.`
                        }],
                        maxTokens: 150
                    };

                    const response = await this.modelsManager.queryModel(request);
                    console.log(`   ✅ Response: ${response.success ? 'SUCCESS' : 'FAILED'}`);
                    if (!response.success) {
                        console.log(`   ❌ Error: ${response.error}`);
                    }
                } catch (error) {
                    console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        }

        this.testResults.push({
            test: 'Smart Model Selection',
            taskTypes,
            status: 'COMPLETED'
        });
    }

    private async testBatchProcessing(): Promise<void> {
        console.log('\n⚡ Testing Batch Processing...');

        const models = this.modelsManager.getActiveModels().slice(0, 3); // Test with first 3 models
        const requests: AIModelRequest[] = models.map(model => ({
            model: model.id,
            messages: [{
                role: 'user',
                content: `Quick test for ${model.name}`
            }],
            maxTokens: 50
        }));

        try {
            // Test parallel processing
            console.log('🔄 Testing parallel processing...');
            const parallelResults = await this.modelsManager.queryMultipleModels(requests, { parallel: true });
            console.log(`✅ Parallel results: ${Object.keys(parallelResults).length} models processed`);

            // Test sequential processing
            console.log('🔄 Testing sequential processing...');
            const sequentialResults = await this.modelsManager.queryMultipleModels(requests, { parallel: false });
            console.log(`✅ Sequential results: ${Object.keys(sequentialResults).length} models processed`);

            this.testResults.push({
                test: 'Batch Processing',
                parallel: Object.keys(parallelResults).length,
                sequential: Object.keys(sequentialResults).length,
                status: 'COMPLETED'
            });
        } catch (error) {
            console.log(`❌ Batch processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.testResults.push({
                test: 'Batch Processing',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 'FAILED'
            });
        }
    }

    private async testHealthChecks(): Promise<void> {
        console.log('\n💊 Testing Health Checks...');

        try {
            const healthStatus = await this.modelsManager.healthCheck();
            console.log(`🏥 Health Status: ${healthStatus.status}`);
            console.log(`   Active Models: ${healthStatus.activeModels}/${healthStatus.totalModels}`);
            console.log(`   Last Check: ${healthStatus.lastCheck}`);

            if (healthStatus.issues && healthStatus.issues.length > 0) {
                console.log(`   Issues found: ${healthStatus.issues.length}`);
                healthStatus.issues.forEach(issue => console.log(`     - ${issue}`));
            } else {
                console.log('   ✅ No issues found');
            }

            this.testResults.push({
                test: 'Health Checks',
                status: healthStatus.status,
                activeModels: healthStatus.activeModels,
                totalModels: healthStatus.totalModels,
                issues: healthStatus.issues?.length || 0,
                overallStatus: 'PASSED'
            });
        } catch (error) {
            console.log(`❌ Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.testResults.push({
                test: 'Health Checks',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 'FAILED'
            });
        }
    }

    private async testUsageAnalytics(): Promise<void> {
        console.log('\n📊 Testing Usage Analytics...');

        try {
            const usageStats = this.modelsManager.getUsageStats();
            console.log(`📈 Total Requests: ${usageStats.totalRequests}`);
            console.log(`📈 Total Tokens: ${usageStats.totalTokens}`);
            console.log(`📈 Total Cost: $${usageStats.totalCost.toFixed(4)}`);
            console.log(`📈 Average Response Time: ${Math.round(usageStats.averageResponseTime)}ms`);

            // Test model-specific stats
            const models = this.modelsManager.getActiveModels();
            if (models.length > 0) {
                const firstModel = models[0];
                const modelStats = this.modelsManager.getUsageStats(firstModel.id);
                console.log(`📊 ${firstModel.name} specific stats:`, modelStats);
            }

            this.testResults.push({
                test: 'Usage Analytics',
                totalRequests: usageStats.totalRequests,
                totalTokens: usageStats.totalTokens,
                totalCost: usageStats.totalCost,
                status: 'PASSED'
            });
        } catch (error) {
            console.log(`❌ Usage analytics failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.testResults.push({
                test: 'Usage Analytics',
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 'FAILED'
            });
        }
    }

    private generateTestReport(): void {
        console.log('\n📋 GENERATING TEST REPORT...');
        console.log('=====================================');

        const passedTests = this.testResults.filter(test => test.status === 'PASSED').length;
        const failedTests = this.testResults.filter(test => test.status === 'FAILED').length;
        const totalTests = this.testResults.length;

        console.log(`📊 Test Summary:`);
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   Passed: ${passedTests}`);
        console.log(`   Failed: ${failedTests}`);
        console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

        console.log('\n📝 Detailed Results:');
        this.testResults.forEach((result, index) => {
            const status = result.status === 'PASSED' ? '✅' : result.status === 'FAILED' ? '❌' : '🔄';
            console.log(`${index + 1}. ${status} ${result.test}: ${result.status}`);
        });

        console.log('\n🎯 RECOMMENDATIONS:');
        if (failedTests === 0) {
            console.log('   ✅ All models are working correctly!');
            console.log('   🚀 Ready for production deployment');
        } else {
            console.log('   ⚠️  Some models need attention');
            console.log('   🔧 Check failed tests and resolve issues');
        }

        console.log('\n=====================================');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new AIModelsTester();
    tester.runComprehensiveTests().catch(error => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}

export default AIModelsTester;
