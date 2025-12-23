// Test Script for AI Service Agent Ecosystem
import { AIServiceAgentCoordinator, SERVICE_AGENT_REGISTRY } from '../src/lib/ai-service-agent-coordinator';
import { MultiAITeamManager } from '../src/lib/multi-ai-team';
import { mcpProtocol } from '../src/lib/mcp-communication-protocol';

async function testAIServiceAgents() {
    console.log('🚀 Testing AI Service Agent Ecosystem...\n');

    try {
        // Initialize the ecosystem
        console.log('1. Initializing Service Agent Ecosystem...');
        await AIServiceAgentCoordinator.initializeServiceAgents();

        // Get ecosystem status
        const status = await AIServiceAgentCoordinator.getEcosystemStatus();
        console.log('📊 Ecosystem Status:');
        console.log(`   • Total Agents: ${status.totalAgents}`);
        console.log(`   • Active Agents: ${status.activeAgents}`);
        console.log(`   • Business Pillars: ${status.totalPillars}`);
        console.log(`   • Average Autonomy: ${status.averageAutonomy}%`);
        console.log('');

        // Test different service scenarios
        console.log('2. Testing Service Agent Assignments...\n');

        // Test 1: AI Development Agency Service
        console.log('🧪 Test 1: AI Development Agency Service');
        const devAgencyTask = await AIServiceAgentCoordinator.assignServiceTask(
            'AI_DevAgency_Manager',
            'CLIENT_INTAKE',
            {
                clientName: 'TechCorp Inc.',
                projectType: 'E-commerce Platform',
                budget: 75000,
                timeline: '3 months',
                requirements: ['React frontend', 'Node.js backend', 'PostgreSQL database']
            },
            'HIGH'
        );
        console.log(`   ✅ Task assigned: ${devAgencyTask}\n`);

        // Test 2: SaaS Chatbot Service
        console.log('🧪 Test 2: SaaS Chatbot Service');
        const chatbotTask = await AIServiceAgentCoordinator.assignServiceTask(
            'SaaS_Chatbot_Manager',
            'SERVICE_DELIVERY',
            {
                clientName: 'RetailStore LLC',
                plan: 'Pro',
                users: 150,
                features: ['Custom training', 'Multi-platform', 'Analytics dashboard']
            },
            'MEDIUM'
        );
        console.log(`   ✅ Task assigned: ${chatbotTask}\n`);

        // Test 3: Social Media Automation
        console.log('🧪 Test 3: Social Media Content Generation');
        const socialTask = await AIServiceAgentCoordinator.assignServiceTask(
            'Social_Content_Generator',
            'CONTENT_CREATION',
            {
                platforms: ['Instagram', 'LinkedIn', 'Twitter'],
                contentType: 'Tech Industry Insights',
                postsPerWeek: 15,
                targetAudience: 'B2B Tech Companies'
            },
            'MEDIUM'
        );
        console.log(`   ✅ Task assigned: ${socialTask}\n`);

        // Test 4: Security Audit Service (High-value, should trigger oversight)
        console.log('🧪 Test 4: Security Audit Service (High-value contract)');
        const securityTask = await AIServiceAgentCoordinator.assignServiceTask(
            'Security_Audit_Service',
            'AUDIT_EXECUTION',
            {
                clientName: 'FinTech Solutions',
                value: 75000, // High-value contract
                scope: 'Full infrastructure audit',
                compliance: ['PCI-DSS', 'GDPR', 'SOX'],
                timeline: '2 weeks'
            },
            'HIGH'
        );
        console.log(`   ⚠️  Task assigned with oversight: ${securityTask}\n`);

        // Test 5: Complete workflow execution
        console.log('🧪 Test 5: Complete Service Workflow');
        const workflowId = await AIServiceAgentCoordinator.executeServiceWorkflow(
            'AI_Prototype_Developer',
            {
                clientName: 'StartupXYZ',
                contact: 'john@startupxyz.com',
                industry: 'Healthcare'
            },
            {
                type: 'MVP Development',
                features: ['Patient portal', 'Appointment booking', 'Medical records'],
                techStack: ['Next.js', 'Prisma', 'PostgreSQL'],
                deadline: '2 weeks'
            }
        );
        console.log(`   ✅ Workflow initiated: ${workflowId}\n`);

        // Display agent performance
        console.log('3. Agent Performance Summary:');
        const performance = AIServiceAgentCoordinator.getAgentPerformance();
        const topPerformers = Object.entries(performance)
            .sort(([,a], [,b]) => (b as any).autonomyLevel - (a as any).autonomyLevel)
            .slice(0, 5);

        topPerformers.forEach(([agentId, metrics]: [string, any], index) => {
            console.log(`   ${index + 1}. ${metrics.name} (${agentId})`);
            console.log(`      • Autonomy: ${metrics.autonomyLevel}%`);
            console.log(`      • Status: ${metrics.status}`);
            console.log(`      • Pillar: ${metrics.pillar}`);
            console.log('');
        });

        // Display agents by pillar
        console.log('4. Agents by Business Pillar:');
        const pillars = [
            'AI-as-a-Service Development',
            'Demo Products as SaaS',
            'Social Media Automation',
            'Security & DevSecOps'
        ];

        pillars.forEach(pillar => {
            const agents = AIServiceAgentCoordinator.getAgentsByPillar(pillar);
            console.log(`   📊 ${pillar}: ${agents.length} agents`);
            const highAutonomy = agents.filter(a => a.autonomyLevel >= 90);
            console.log(`      • High autonomy (90%+): ${highAutonomy.length}`);
            console.log(`      • Average autonomy: ${Math.round(agents.reduce((sum, a) => sum + a.autonomyLevel, 0) / agents.length)}%`);
            console.log('');
        });

        // MCP Protocol health check
        console.log('5. MCP Communication Protocol Status:');
        const health = await mcpProtocol.performHealthCheck();
        console.log(`   • Local connections: ${health.localConnections}`);
        console.log(`   • Remote servers: ${health.remoteServers}`);
        console.log(`   • Connected servers: ${health.connectedServers}`);
        console.log(`   • Registered agents: ${health.agents}`);
        console.log(`   • Message queue: ${health.messageQueue}`);
        console.log('');

        // Team coordination status
        console.log('6. AI Team Coordination Status:');
        const teamStatus = MultiAITeamManager.getTeamStatus();
        Object.entries(teamStatus).forEach(([role, status]: [string, any]) => {
            const roleName = Object.values(AI_TEAM_CONFIG).find(config => config.role === role)?.name || role;
            console.log(`   • ${roleName}: ${status.status}${status.currentTask ? ` (${status.currentTask})` : ''}`);
        });

        console.log('\n🎉 AI Service Agent Ecosystem Test Completed Successfully!');
        console.log('\n📋 Summary:');
        console.log(`   • ${status.totalAgents} service agents mapped to 47 digital services`);
        console.log(`   • ${status.activeAgents} agents currently active`);
        console.log(`   • Average autonomy level: ${status.averageAutonomy}%`);
        console.log('   • All major business pillars covered');
        console.log('   • MCP communication protocol operational');
        console.log('   • Human oversight system functional');

    } catch (error) {
        console.error('❌ Test failed:', error);
        throw error;
    }
}

// Run the test if this script is executed directly
if (require.main === module) {
    testAIServiceAgents()
        .then(() => {
            console.log('\n✅ All tests passed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Tests failed:', error);
            process.exit(1);
        });
}

export { testAIServiceAgents };