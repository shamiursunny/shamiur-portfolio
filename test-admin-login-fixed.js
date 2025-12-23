// Simple test to verify admin login credentials
const bcrypt = require('bcryptjs');

// Test password hash verification
const userPassword = 'Shahid@221286';

async function verifyPassword() {
    try {
        // This is the hash that should be in the database for "Shahid@221286"
        const storedHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewlMJiIXXq6z1X2G';

        const isValid = await bcrypt.compare(userPassword, storedHash);
        console.log(`Password "${userPassword}" verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

        if (isValid) {
            console.log('✅ Admin credentials should work correctly');
        } else {
            console.log('❌ Password hash mismatch - need to reseed database');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

verifyPassword();
