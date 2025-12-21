const http = require('http');

const data = JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }]
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d.toString());
    });
    res.on('end', () => {
        console.log('\nResponse ended.');
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
