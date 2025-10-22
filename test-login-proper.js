const http = require('http');

// Step 1: Get CSRF token
console.log('🔍 Getting CSRF token...');
const csrfReq = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/csrf',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const csrfData = JSON.parse(data);
      const csrfToken = csrfData.csrfToken;
      console.log('CSRF token:', csrfToken);
      
      // Step 2: Login with CSRF token
      console.log('\n🔍 Logging in with CSRF token...');
      const loginData = JSON.stringify({
        email: 'admin@sunny.dev',
        password: 'admin123',
        csrfToken: csrfToken
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
        console.log('Login status:', res.statusCode);
        console.log('Login headers:', res.headers);
        
        let loginData = '';
        res.on('data', chunk => loginData += chunk);
        res.on('end', () => {
          console.log('Login response:', loginData);
          
          // Step 3: Check session after login
          console.log('\n🔍 Checking session after login...');
          const cookies = res.headers['set-cookie'] ? res.headers['set-cookie'].join('; ') : '';
          
          const sessionReq = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/session',
            method: 'GET',
            headers: {
              'Cookie': cookies
            }
          }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              console.log('Session after login:', data);
            });
          });
          sessionReq.end();
        });
      });
      
      loginReq.write(loginData);
      loginReq.end();
      
    } catch (error) {
      console.error('Error parsing CSRF response:', error);
    }
  });
});

csrfReq.end();