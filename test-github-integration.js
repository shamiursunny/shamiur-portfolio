// Simple test script for GitHub integration
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testGitHubToken() {
    try {
        console.log('=== TESTING GITHUB INTEGRATION ===\n');

        // Check GitHub token
        const githubToken = await prisma.setting.findUnique({
            where: { key: 'GITHUB_TOKEN' }
        });

        console.log('🔐 GitHub Token Status:', githubToken ? '✅ FOUND' : '❌ NOT FOUND');
        if (githubToken) {
            console.log('   Prefix:', githubToken.value.substring(0, 10) + '...');
        }

        // Check other AI settings
        const aiKeys = await prisma.setting.findMany({
            where: { key: { contains: 'KEY' } }
        });

        console.log('\n🤖 AI API Keys Found:', aiKeys.length);
        aiKeys.forEach(setting => {
            console.log(`   ${setting.key}: ${setting.value.substring(0, 15)}...`);
        });

        console.log('\n✅ System health check completed');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testGitHubToken();
