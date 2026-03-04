import axios from 'axios';
import prisma from './server/prisma';

async function test() {
    try {
        console.log('Attempting registration...');
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            email: 'testuser_verified_final@example.com',
            password: 'Password123!'
        });
        console.log('Response:', response.data);

        const user = await prisma.user.findUnique({
            where: { email: 'testuser_verified_final@example.com' }
        });
        console.log('Database Record:', JSON.stringify(user, null, 2));

    } catch (err: any) {
        console.error('Test Failed:', err.response?.data || err.message);
    }
    process.exit(0);
}

test();
