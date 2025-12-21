
const fetch = require('node-fetch');

async function testGateway() {
    const apiKey = 'vck_...LRoM'; // The key from the logs
    const url = 'https://ai-gateway.vercel.sh/v1/chat/completions';

    console.log(`Testing URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: 'Hello' }],
                stream: false
            })
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        console.log(`Response: ${text}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

testGateway();
