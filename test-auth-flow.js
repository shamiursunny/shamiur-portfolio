const http = require('http');

// Test 1: Check if session endpoint is working
console.log('🔍 Testing session endpoint...');
const sessionReq = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/session',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Session response:', data);
    
    // Test 2: Try to login
    console.log('\n🔍 Testing login...');
    const loginData = JSON.stringify({
      email: 'admin@sunny.dev',
      password: 'admin123',
      csrfToken: 'test'
    });
    
    const loginReq = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/callback/credentials',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, (res) => {
      let loginData = '';
      res.on('data', chunk => loginData += chunk);
      res.on('end', () => {
        console.log('Login response status:', res.statusCode);
        console.log('Login response headers:', res.headers);
        console.log('Login response body:', loginData);
        
        // Test 3: Check session after login
        console.log('\n🔍 Testing session after login...');
        const sessionReq2 = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/auth/session',
          method: 'GET',
          headers: {
            'Cookie': res.headers['set-cookie'] ? res.headers['set-cookie'].join('; ') : ''
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            console.log('Session after login:', data);
          });
        });
        sessionReq2.end();
      });
    });
    loginReq.write(loginData);
    loginReq.end();
  });
});

sessionReq.end();