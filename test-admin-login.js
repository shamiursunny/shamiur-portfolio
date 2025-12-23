// Simple test to verify admin login credentials
const bcrypt = require('bcryptjs');

// Test password hash verification
const testPassword = 'Shahid@221286';
const expectedHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewlMJiIXXq6z1X2G'; // This should match the hash in database

async function testPassword() {
    try {
        // This is the hash that should be in the database for "Shahid@221286"
        const storedHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewlMJiIXXq6z1X2G';

        const isValid = await bcrypt.compare(testPassword, storedHash);
        console.log(`Password "${testPassword}" verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

        if (isValid) {
            console.log('✅ Admin credentials should work correctly');
        } else {
            console.log('❌ Password hash mismatch - need to reseed database');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testPassword();
