import axios from 'axios';

async function verify() {
    try {
        console.log('1. Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'testuser_verified_final@example.com',
            password: 'Password123!'
        });
        const { accessToken } = loginRes.data;
        console.log('Login successful, received token.');

        console.log('2. Verifying /api/auth/me with token...');
        const meRes = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Profile Response:', meRes.data.email);

        if (meRes.data.email === 'testuser_verified_final@example.com') {
            console.log('SUCCESS: 401 issue resolved for /api/auth/me');
        }

    } catch (err: any) {
        console.error('Verification Failed:', err.response?.data || err.message);
    }
    process.exit(0);
}

verify();
