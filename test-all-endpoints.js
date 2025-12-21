// Test all AI agent endpoints
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAllEndpoints() {
    try {
        console.log('=== TESTING ALL AI AGENT ENDPOINTS ===\n');

        // Get GitHub token
        const githubToken = await prisma.setting.findUnique({
            where: { key: 'GITHUB_TOKEN' }
        });

        if (!githubToken) {
            console.log('❌ GitHub token not found - cannot test endpoints');
            return;
        }

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        // Test GitHub endpoint
        console.log('🔍 Testing GitHub API endpoint...');
        try {
            const githubResponse = await fetch(`${baseUrl}/api/ai/agent/github`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'list_repos',
                    token: githubToken.value
                })
            });

            const githubResult = await githubResponse.json();
            console.log('   GitHub API:', githubResponse.status === 200 ? '✅ RESPONDING' : '❌ ERROR');
            if (githubResult.success) {
                console.log('   Repositories found:', githubResult.data?.length || 0);
            }
        } catch (error) {
            console.log('   GitHub API: ❌ FAILED -', error.message);
        }

        // Test Chat endpoint
        console.log('\n💬 Testing Chat API endpoint...');
        try {
            const chatResponse = await fetch(`${baseUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'user', content: 'Hello, test message' }
                    ]
                })
            });

            console.log('   Chat API:', chatResponse.status === 200 ? '✅ RESPONDING' : '❌ ERROR');
            if (chatResponse.status !== 200) {
                const errorText = await chatResponse.text();
                console.log('   Error:', errorText);
            }
        } catch (error) {
            console.log('   Chat API: ❌ FAILED -', error.message);
        }

        // Test other endpoints
        const endpoints = [
            '/api/ai/agent/build',
            '/api/ai/agent/automate',
            '/api/ai/agent/social',
            '/api/ai/agent/scan'
        ];

        for (const endpoint of endpoints) {
            console.log(`\n🔍 Testing ${endpoint}...`);
            try {
                const response = await fetch(`${baseUrl}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ test: true })
                });

                console.log(`   ${endpoint}:`, response.status === 200 ? '✅ RESPONDING' : '❌ ERROR');
            } catch (error) {
                console.log(`   ${endpoint}: ❌ FAILED -`, error.message);
            }
        }

        console.log('\n✅ All endpoint tests completed');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAllEndpoints();
