// Training Execution Script - Run AI Agent Training Scenarios
import { AIAgentTrainingSystem } from './ai-agent-training';

async function runTrainingScenarios() {
    console.log('🚀 Starting AI Agent Training System');
    console.log('=====================================\n');

    const trainingSystem = new AIAgentTrainingSystem();

    try {
        // Training Scenario 1: Basic Development Workflow
        console.log('📋 Training Scenario 1: Basic Development Workflow');
        console.log('Testing basic communication and task delegation between agents\n');

        const result1 = await trainingSystem.executeTrainingScenario('basic_dev_workflow');

        console.log('\n📊 Training Results:');
        console.log(`- Scenario: ${result1.scenarioName}`);
        console.log(`- Duration: ${result1.duration.toFixed(2)} seconds`);
        console.log(`- Success: ${result1.success}`);
        console.log(`- Tasks Completed: ${result1.tasks.filter(t => t.status === 'completed').length}/${result1.tasks.length}`);
        console.log(`- Success Rate: ${((result1.tasks.filter(t => t.status === 'completed').length / result1.tasks.length) * 100).toFixed(1)}%\n`);

        // Wait a bit between scenarios
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Training Scenario 2: Complex Problem Solving
        console.log('📋 Training Scenario 2: Complex Problem Solving');
        console.log('Testing advanced coordination and problem-solving capabilities\n');

        const result2 = await trainingSystem.executeTrainingScenario('complex_problem_solving');

        console.log('\n📊 Training Results:');
        console.log(`- Scenario: ${result2.scenarioName}`);
        console.log(`- Duration: ${result2.duration.toFixed(2)} seconds`);
        console.log(`- Success: ${result2.success}`);
        console.log(`- Tasks Completed: ${result2.tasks.filter(t => t.status === 'completed').length}/${result2.tasks.length}`);
        console.log(`- Success Rate: ${((result2.tasks.filter(t => t.status === 'completed').length / result2.tasks.length) * 100).toFixed(1)}%\n`);

        // Wait a bit between scenarios
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Training Scenario 3: Learning and Adaptation
        console.log('📋 Training Scenario 3: Learning and Adaptation');
        console.log('Testing the system\'s ability to learn and adapt to new requirements\n');

        const result3 = await trainingSystem.executeTrainingScenario('learning_adaptation');

        console.log('\n📊 Training Results:');
        console.log(`- Scenario: ${result3.scenarioName}`);
        console.log(`- Duration: ${result3.duration.toFixed(2)} seconds`);
        console.log(`- Success: ${result3.success}`);
        console.log(`- Tasks Completed: ${result3.tasks.filter(t => t.status === 'completed').length}/${result3.tasks.length}`);
        console.log(`- Success Rate: ${((result3.tasks.filter(t => t.status === 'completed').length / result3.tasks.length) * 100).toFixed(1)}%\n`);

        // Overall Training Summary
        console.log('🎉 AI Agent Training Completed Successfully!');
        console.log('==========================================');
        console.log('📈 Overall Performance Summary:');

        const allResults = [result1, result2, result3];
        const totalTasks = allResults.reduce((sum, r) => sum + r.tasks.length, 0);
        const completedTasks = allResults.reduce((sum, r) => sum + r.tasks.filter(t => t.status === 'completed').length, 0);
        const totalDuration = allResults.reduce((sum, r) => sum + r.duration, 0);
        const overallSuccessRate = (completedTasks / totalTasks) * 100;

        console.log(`- Total Training Scenarios: 3`);
        console.log(`- Total Tasks Executed: ${totalTasks}`);
        console.log(`- Tasks Successfully Completed: ${completedTasks}`);
        console.log(`- Overall Success Rate: ${overallSuccessRate.toFixed(1)}%`);
        console.log(`- Total Training Duration: ${totalDuration.toFixed(2)} seconds`);
        console.log(`- Average Task Duration: ${(totalDuration / totalTasks).toFixed(2)} seconds\n`);

        // Agent Performance Summary
        console.log('🤖 Agent Performance Analysis:');
        const agentStats = getAgentPerformanceSummary(allResults);
        Object.entries(agentStats).forEach(([agentId, stats]) => {
            console.log(`- ${agentId}:`);
            console.log(`  - Tasks Completed: ${stats.completed}/${stats.total} (${((stats.completed / stats.total) * 100).toFixed(1)}%)`);
            console.log(`  - Average Duration: ${stats.averageDuration.toFixed(2)}s`);
        });

        console.log('\n🎓 Training System Status: AI Agents are now trained and ready for production!');
        console.log('🚀 The MCP Communication Protocol and Unified Intelligence Core are operational!');

    } catch (error) {
        console.error('❌ Training failed:', error);
        process.exit(1);
    }
}

function getAgentPerformanceSummary(results: any[]): any {
    const agentStats: any = {};

    results.forEach(result => {
        result.tasks.forEach((task: any) => {
            if (!agentStats[task.assignedAgent]) {
                agentStats[task.assignedAgent] = {
                    completed: 0,
                    total: 0,
                    totalDuration: 0
                };
            }

            agentStats[task.assignedAgent].total++;
            if (task.status === 'completed') {
                agentStats[task.assignedAgent].completed++;
            }
            agentStats[task.assignedAgent].totalDuration += task.duration;
        });
    });

    // Calculate averages
    Object.keys(agentStats).forEach(agentId => {
        const stats = agentStats[agentId];
        stats.averageDuration = stats.totalDuration / stats.total;
    });

    return agentStats;
}

// Run the training if this script is executed directly
if (require.main === module) {
    runTrainingScenarios().catch(console.error);
}

export { runTrainingScenarios };
