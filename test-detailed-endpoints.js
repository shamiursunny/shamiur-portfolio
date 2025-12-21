// Detailed endpoint testing with full response analysis
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testDetailedEndpoints() {
    try {
        console.log("=== DETAILED ENDPOINT TESTING ===\n");

        const baseUrl = "http://localhost:3000";

        // Test 1: Health check
        console.log("🔍 Testing health endpoint...");
        try {
            const response = await fetch(`${baseUrl}/api/health`);
            console.log(`   Health: ${response.status} ${response.statusText}`);
            if (response.ok) {
                const data = await response.json();
                console.log("   Response:", JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.log(`   Health: ❌ ${error.message}`);
        }

        // Test 2: GitHub API
        console.log("\n🔍 Testing GitHub API endpoint...");
        const githubToken = await prisma.setting.findUnique({
            where: { key: "GITHUB_TOKEN" },
        });

        if (!githubToken) {
            console.log("   ❌ GitHub token not found");
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/ai/agent/github`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "list_repos",
                    token: githubToken.value,
                }),
            });

            console.log(`   GitHub: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log(`   Raw response: ${text.substring(0, 200)}...`);

            if (text) {
                try {
                    const data = JSON.parse(text);
                    console.log(
                        `   Parsed: ${data.success ? "✅ SUCCESS" : "❌ FAILED"}`
                    );
                    if (data.success) {
                        console.log(`   Repos found: ${data.data?.length || 0}`);
                    } else {
                        console.log(`   Error: ${data.error}`);
                    }
                } catch (e) {
                    console.log("   JSON parse error:", e.message);
                }
            }
        } catch (error) {
            console.log(`   GitHub: ❌ ${error.message}`);
        }

        // Test 3: Settings API
        console.log("\n🔍 Testing Settings API...");
        try {
            const response = await fetch(`${baseUrl}/api/settings`);
            console.log(`   Settings: ${response.status} ${response.statusText}`);
            if (response.ok) {
                const data = await response.json();
                console.log(`   Settings count: ${data.length || 0}`);
            }
        } catch (error) {
            console.log(`   Settings: ❌ ${error.message}`);
        }

        // Test 4: Simple contact endpoint
        console.log("\n🔍 Testing Contact API...");
        try {
            const response = await fetch(`${baseUrl}/api/contact`, {
                method: "GET",
            });
            console.log(`   Contact: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.log(`   Contact: ❌ ${error.message}`);
        }

        // Test 5: Test other AI agent endpoints
        const aiEndpoints = [
            '/api/ai/agent/build',
            '/api/ai/agent/automate',
            '/api/ai/agent/social',
            '/api/ai/agent/scan'
        ];

        console.log("\n🔍 Testing AI Agent endpoints...");
        for (const endpoint of aiEndpoints) {
            try {
                const response = await fetch(`${baseUrl}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ test: true })
                });

                console.log(`   ${endpoint}: ${response.status} ${response.statusText}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`      Response: ${JSON.stringify(data, null, 2).substring(0, 100)}...`);
                }
            } catch (error) {
                console.log(`   ${endpoint}: ❌ ${error.message}`);
            }
        }

        console.log("\n✅ Detailed testing completed");

    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testDetailedEndpoints();
