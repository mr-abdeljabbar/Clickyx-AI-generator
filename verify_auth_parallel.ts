import axios from 'axios';

async function verifyParallel() {
    try {
        console.log('1. Logging in to get initial tokens...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'testuser_verified_final@example.com',
            password: 'Password123!'
        });
        const initialToken = loginRes.data.accessToken;
        const cookie = loginRes.headers['set-cookie'];
        console.log('Login successful.');

        console.log('2. Firing 5 parallel requests to /api/auth/me...');
        // We simulate parallel requests. In a real browser, these would all use the same cookie and (initially) same token.
        // If the token expires, they should all trigger a refresh. 
        // Our fix should ensure only one refresh happens.

        const requests = Array.from({ length: 5 }).map((_, i) => {
            return axios.get('http://localhost:5000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${initialToken}`,
                    Cookie: cookie ? cookie[0] : ''
                }
            }).then(res => {
                console.log(`Request ${i + 1} Result:`, res.data.email);
                return res;
            });
        });

        const results = await Promise.allSettled(requests);
        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        console.log(`Parallel Requests Finished: ${succeeded}/5 succeeded.`);

        if (succeeded === 5) {
            console.log('SUCCESS: Parallel requests handled correctly.');
        } else {
            console.log('FAILURE: Some parallel requests failed.');
        }

    } catch (err: any) {
        console.error('Verification Failed:', err.response?.data || err.message);
    }
    process.exit(0);
}

verifyParallel();
